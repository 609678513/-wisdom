
const personHelper = require("../service/dbHelper/personHelper")
const agreedRecordHelper = require("../service/dbHelper/agreedRecordHelper")
const enums = require('../enums')
const _ = require('lodash')
const moment = require('moment')


// 邀约查询
exports.findRecords = async (query) => {
  return await agreedRecordService.find(query)
}

// 查询所有邀约记录
exports.find = async (params) => {
  console.log('这里的参数', params)
  if (params.date) {
    params['agreementDate.start'] = {
      $gte: params.date[0],
      $lte: params.date[1]
    }
    delete params.date
  }
  if (params.keyword) {
    params['$or'] = [{
      'tel': {
        $regex: params.keyword
        , $options: '$i'}
    }, {
      'name': {
        $regex: params.keyword
        , $options: '$i'}
    }]
  }
  params['deleted'] = false
  delete params.keyword
  delete params.pageSize
  delete params.pageIndex
  // if (params.sponsor) {
  //   params.sponsor = mongoose.Types.ObjectId(params.sponsor)
  // }
  // if (params.recipient) {
  //   params.recipient = mongoose.Types.ObjectId(params.recipient)
  // }
  let populate
  if (params.populate) {
    populate = params.populate
    delete params.populate
  }
  let sort
  if (params.page) {
    let page = params.page
    delete params.page
    console.log('邀约的关联查询', params, page, populate)
    return await agreedRecordHelper.pageQuery2(params, page, populate)
  } else {
    return await agreedRecordHelper.find(params, populate, sort = {'createTime': 1})
  }
}

exports.findOne = async (filter) => {
  return agreedRecordHelper.findOne(filter)
},

exports.update = async (body) => {
    let docOld = ''
    let doc = ''
    let filter = {
    deleted: body.deleted,
      _id: body._id
     }
    try {
      docOld = await agreedRecordHelper.findOne(filter)
      console.log('邀约记录1', docOld)
      doc = await agreedRecordHelper.findOneAndUpdate(filter, body, {new: false})
      console.log('邀约记录2', doc)
      doc.agreementDate.agreementTime = moment(doc.agreementDate.start).format('YYYY-MM-DD ') + enums.AGREEMENT_TIME[doc.agreementDate.type]
      if (body.status == doc.status) {
        // 前后状态一致，不再发送消息
        return doc
      }
      console.log('邀约记录前后状态不一致啊！！！！')
      // 发送短信
      // messageEmitter.emit('dbCRUD', {model: 'agreedRecord', operation: '_update', body: doc})
    } catch (err) {
      if (doc && docOld) {
        // redis 出错，回滚，否则数据库出错
        await agreedRecordHelper.findOneAndUpdate(filter, docOld)
      }
      throw err
    }
    return doc
  }

exports.cancleInvite = async (body) => {
  let docOld = ''
  let doc = ''
  let filter = {
    deleted: body.deleted,
    _id: body._id
  }
  try {
    docOld = await agreedRecordHelper.findOne(filter)
    console.log('取消查询', docOld)
    docOld.status = 2
    docOld.closeReason = body.cancleReason
    docOld.updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('取消更新前', docOld)
    doc = await agreedRecordHelper.findOneAndUpdate(filter, docOld, {new: false})
    console.log('取消更新成功', doc)
    if (body.status == doc.status) {
      // 前后状态一致，不再发送消息
      return doc
    }
    console.log('取消发送短信了！！！！！')
    // 发送短信
    // messageEmitter.emit('dbCRUD', {model: 'agreedRecord', operation: '_update', body: doc})
  } catch (err) {
    if (doc && docOld) {
      // redis 出错，回滚，否则数据库出错
      await agreedRecordHelper.findOneAndUpdate(filter, docOld)
    }
    throw err
  }
  return doc
}
// 添加邀约记录
async function addInvitationRecord(body) {
  let sponsor = await personHelper.findOne({_id: body.sponsor})
  if ( sponsor && sponsor.tel === body.tel) {
    throw new Error('无法邀约自己')
  }
  let res = await agreedRecordHelper.add(body)
  console.log('控制添加邀约记录', res)
  return res
}

// 添加单条邀约记录
exports.addInvitationRecord = async (body) => {
  return await addInvitationRecord(body)
}





