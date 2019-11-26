
const personController = require('../controller/personController')
const personHelper = require("../service/dbHelper/personHelper")
const agreedRecordHelper = require("../service/dbHelper/agreedRecordHelper")
const notification = require("../notification/smsController")
const baidu  = require('../thirdparty/controller/BaiDuFaceRecognition')

const enums = require('../enums')
const _ = require('lodash')
const moment = require('moment')
const lodash = require('lodash')



// 添加邀约记录
async function addInvitationRecord(body) {
  let sponsor = await personHelper.findOne({_id: body.sponsor})
  if (sponsor && sponsor.tel === body.tel) {
    throw new Error('无法邀约自己')
  }
  let employees = await personHelper.findOne({tel: body.tel,type: 0})
  if (employees) {
    throw new Error('不能邀请本公司员工')
  }
  // 判断是否存在访客信息
  let recipient = await personHelper.findOne({tel: body.tel,type: 1})
  let agreedRecord = lodash.cloneDeep(body)
  if (recipient) {
    console.log('访客存在直接赋值', recipient._id)
    agreedRecord.recipient = recipient._id
  }else {
    let res = await addVisitorInformation(agreedRecord)
    console.log('访客不存在添加人员信息', res)
    agreedRecord.recipient = res._id
  }
  let res = await agreedRecordHelper.add(agreedRecord)
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
// 添加访客信息
async function addVisitorInformation(invitationRecord) {
  let person ={
    type: 1,             // 人员类型
    certificateType: 0,  // 证件类型
    gender: 2,           // 性别
    name: invitationRecord.name,               // 姓名
    tel: invitationRecord.tel,                 // 联系电话
    updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),// 更新时间
  }
  person.photo = invitationRecord.photo? invitationRecord.photo : '' // 识别照片
  person.company = invitationRecord.company? invitationRecord.company : '' // 公司
  person.position = invitationRecord.position? invitationRecord.position : ''  // 职位
  person.remark = invitationRecord.remark? invitationRecord.remark : '' // 备注
  // 注册人脸 并进入访客信息
  let res = await personController.add(person)
  console.log('邀约记录添加到访客信息成功', res)
  return res
}
// 更新访客信息
async function updateVisitorInformation(invitationRecord) {
  let visitor = await personController.findOne({_id:invitationRecord.recipient,type: 1})
  if(visitor){
      visitor.name= invitationRecord.name             // 姓名
      visitor.tel = invitationRecord.tel              // 联系电话
      visitor.photo = invitationRecord.photo            // 识别照片
      visitor.company = invitationRecord.company         // 公司
      visitor.position = invitationRecord.position         // 职位
      visitor.certificateNumber = invitationRecord.certificateNumber // 证件号码
      visitor.updateTime = moment().format('YYYY-MM-DD HH:mm:ss') // 更新时间
  }
  // 更新访客信息，并注册人脸
  let res = await personController.update(visitor)
  console.log('邀约记录添加到访客信息中', res)
  return res
}

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
    let docOld = '' // 修改前的邀约
    let doc = '' // 修改的邀约 相当于修改前的
    let filter = {
    deleted: body.deleted,
      _id: body._id
     }
    try {
      docOld = await agreedRecordHelper.findOne(filter)
      // console.log('邀约记录1', docOld)
      doc = await agreedRecordHelper.findOneAndUpdate(filter, body, {new: false})
      if(doc){
        let invitationRecord = await agreedRecordHelper.findOne({_id: doc._id }, 'sponsor receptionist')  // 关联查询修改后的邀约
         // 是否为访客补全信息，是则更新访客信息
        if(body.completion){
          console.log('补全信息的更新访客信息开始')
          let res = await updateVisitorInformation(invitationRecord)
          console.log('补全信息的更新结果', res)
        }
        // 前后状态一致时 例如为补全 和未到访 时接待人和拜访时间发生改变
        // if (docOld.status === invitationRecord.status) {
        if (invitationRecord.status === 0 || invitationRecord.status === 1) {
          // 未到访、未补全 两个状态如果时间发生改变 发送短信提示时间发生改变
          if(doc.agreementDate.time !== body.agreementDate.time){
            console.log('未到访、未补全 两个状态如果时间发生改变 发送短信提示时间发生改变')
            notification.timeChange(invitationRecord)
          }
          // 接待人发生改变 通知接待人
          if(invitationRecord.receptionist &&(docOld.receptionist + '' !== invitationRecord.receptionist._id + '')){
            console.log(' 接待人发生改变 通知接待人',doc.receptionist, body.receptionist)
            notification.reception(invitationRecord)
          }
          // 前后状态一致，不再发送消息
          return doc
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

      }else {
        return  '没有该条邀约记录！请返回列表页面'
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
    if (doc.status === invitationRecord.status) {
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

// 添加单条邀约记录
exports.addInvitationRecord = async (body) => {
  return await addInvitationRecord(body)
}





