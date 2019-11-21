
const personController = require('../controller/personController')
const personHelper = require("../service/dbHelper/personHelper")
const agreedRecordHelper = require("../service/dbHelper/agreedRecordHelper")
const notification = require("../notification/smsController")
const enums = require('../enums')
const _ = require('lodash')
const moment = require('moment')


// 邀约查询
exports.findRecords = async (query) => {
  return await agreedRecordService.find(query)
}

// 查询所有邀约记录
exports.find = async (params) => {
  // console.log('这里的参数', params)
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
    // console.log('邀约的关联查询', params, page, populate)
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
      // console.log('邀约记录1', docOld)
      doc = await agreedRecordHelper.findOneAndUpdate(filter, body, {new: false})
      // console.log('邀约记录2', doc)
      // doc.agreementDate.agreementTime = moment(doc.agreementDate.start).format('YYYY-MM-DD ') + enums.AGREEMENT_TIME[doc.agreementDate.type]
      let invitationRecord = await agreedRecordHelper.findOne({_id: doc._id }, 'sponsor receptionist')
      console.log('更改前状态', docOld.status)
      console.log('更改该后状态', doc.status)
      if (docOld.status === invitationRecord.status) {
        // 未到访、未补全 两个状态如果时间发生改变 发送短信提示时间发生改变
        if(doc.agreementDate.time !== body.agreementDate.time){
          console.log('未到访、未补全 两个状态如果时间发生改变 发送短信提示时间发生改变')
          notification.timeChange(invitationRecord)
        }
        // 接待人发生改变 通知接待人
        if(body.receptionist && doc.receptionist && (doc.receptionist !== body.receptionist)){
          console.log(' 接待人发生改变 通知接待人')
          notification.reception(invitationRecord)
        }
        // 前后状态一致，不再发送消息
        return doc
      }
      // 未到访 邀约记录添加到访客信息中
      if(invitationRecord.status === 1){
        let person ={
          type: 1,             // 人员类型
          name: doc.name,             // 姓名
          gender: 2,           // 性别
          tel: doc.tel,              // 联系电话
          photo: doc.photo,            // 识别照片
          company: doc.company,          // 公司
          position: doc.position,         // 职位
          remark: doc.remark,           // 备注
          // updateTime: moment().format('YYYY-MM-DD '),// 更新时间
        }
        if (invitationRecord.certificateNumber) {
          person.certificateType = 0  // 证件类型
          person.certificateNumber = doc.certificateNumber// 证件号码
        }
        // 注册人脸 并进入访客信息
        console.log('邀约记录注册人脸')
        personController.add(person)
      }

      // 已到访时 给接待人员发送短信
      if(invitationRecord.status === 3){
        console.log('给接待人发送短信')
        notification.visitInform(invitationRecord)
      }

      // 已失效时 给访客和接待人发送短信
      if(invitationRecord.status === 4){
        console.log('给接待人发送短信')
        notification.cancellation(invitationRecord)
      }

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
    // console.log('取消查询', docOld)
    docOld.status = 2
    docOld.closeReason = body.cancleReason
    docOld.updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    // console.log('取消更新前', docOld)
    doc = await agreedRecordHelper.findOneAndUpdate(filter, docOld, {new: false})
    // console.log('取消更新成功', doc)
    let invitationRecord = await agreedRecordHelper.findOne({_id: doc._id }, 'sponsor receptionist')
    if (body.status === doc.status) {
      // 前后状态一致，不再发送消息
      return doc
    }
    // console.log('取消发送短信了！！！！！')
    // 发送短信
    notification.cancellation(invitationRecord)
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
  // console.log('控制添加邀约记录', res)
  let invitationRecord = await agreedRecordHelper.findOne({_id:res._id }, 'sponsor receptionist')
  // console.log('关联查询', invitationRecord)
  if(invitationRecord){
    // console.log('发送补全信息')
    notification.completeInformation(invitationRecord)
    if(invitationRecord.receptionist){
       // console.log('接待人通知')
       notification.reception(invitationRecord)
    }
  }else {
    throw new Error('短信发送失败')
  }
  return res
}

// 添加单条邀约记录
exports.addInvitationRecord = async (body) => {
  return await addInvitationRecord(body)
}





