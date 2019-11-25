const path = require('path')
const fs = require('fs')
const personHelper = require("../service/dbHelper/personHelper")
const agreedRecordHelper = require("../service/dbHelper/agreedRecordHelper")
const attendanceHelper = require("../service/dbHelper/attendanceHelper")
const baidu  = require('../thirdparty/controller/BaiDuFaceRecognition')
const moment = require('moment')
const lodash = require('lodash')


// 时间段判断
async function  timeBetweenDayFormat (timeS, timeE) {
  let start = new Date(moment(timeS))
  let end = new Date(moment(timeE))
  let now = new Date(moment())
  return (now - start.getTime() > 0) && (end.getTime() - now > 0)
}

function  timeBetweenDayFormatWork () {
  let start = new Date(moment().hours(9).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'))
  let end = new Date(moment().hours(18).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'))
  let now = new Date(moment())
  return (now - start.getTime() > 0) && (end.getTime() - now > 0)
}

// 访客识别操作
async function visitorRecognition (user){
  let business ={
    personName: user.user_info, // 名字
    type : 3,   // 人员类型 0:员工  3：访客
    isOK : false, // 是否开门
    personDeleted: 1  // 人员是否存在 1：存在  0不存在
  }
  let invitationRecord = await agreedRecordHelper.findOne({_id: user.user_id})
  console.log('查找到的邀约记录', invitationRecord)
  if(!invitationRecord){
    business.personDeleted = 0
    return business
  }
  business.isOK = await timeBetweenDayFormat(invitationRecord.agreementDate.start, invitationRecord.agreementDate.end)
  // 写入开门记录
  if(business.isOK){
    let filter ={
      _id: invitationRecord._id
    }
    let body = lodash.cloneDeep(invitationRecord)
    body.arrivalTime = moment().format('YYYY-MM-DD HH:mm:ss')
    body.status = 3
    let res = await agreedRecordHelper.findOneAndUpdate(filter, body)
    console.log('访客到访时间和状态更新',res)
    if(res){
      console.log('访客到访时间和状态更新成功')
    }else {
      console.log('访客到访时间和状态更新失败')
    }
    // 访客写入开门记录
    console.log('访客写入开门记录')
  }
 return business
}

// 员工识别操作
async function employeeRecognition (user){
  let business ={
    personName: user.user_info, // 名字
    type : 0,   // 人员类型 0:员工  3：访客
    isOK : true, // 是否开门
    checkingIn: 1, // 2:已经签到  1：正常签到  0；迟到
    personDeleted: 1  // 人员是否存在 1：存在  0不存在
  }
  let employee = await personHelper.findOne({_id:user.user_id})
  // 员工不存在
  if(!employee){
    business.personDeleted = 0
    return business
  }
  // 查询今天是否考勤，没有则开始考勤
  let date = [
    moment().hours(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
    moment().hours(24).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
  ]
  let attendanceFilter ={
    person: user.user_id,
    createTime: {$gte: date[0], $lt: date[1]},
  }
  // console.log('查询考勤记录开始', attendanceFilter)
  let attendance = await attendanceHelper.find(attendanceFilter, 'person')
  console.log('查询考勤记录', attendance)
  // 存在则正常开门
  if(attendance.length > 0){
    business.checkingIn = 2
  }
  // 没有考勤记录添加考勤记录
  if(attendance.length === 0){
    // console.log('添加考勤记录')
    let body ={
      firstEntryTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      person: user.user_id,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    body.firstType = await timeBetweenDayFormatWork() ? 1 : 0
    business.checkingIn = body.firstType //设置签到类型 返回给提示
    let res = await attendanceHelper.add(body)
    console.log('添加考勤记录成功', res)
    }
  console.log('员工写入开门记录')
  return business
}

// 人脸匹配度最大计算
async function cuccessfulCalculation(users){
  let user
  if(users.length > 1){
    user = users.reduce((a, b) => {
      if (a.score >= b.score) return a
      if (a.score < b.score) return b
    })
    return user
  }else {
    user = users[0]
    return user
  }
}

// 照片上传
exports.uploadPhoto = async (file) => {
  // console.log('路径啊', file)
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let nowFileName = Date.now() + '.' +  file.name.split('.').pop();
  // console.log('路径啊啊啊', global.serverPath)
  // console.log('路径啊啊啊222', __dirname.substring(0,22))
  let filePath = path.join(global.serverPath, '/public/images/') + nowFileName
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  let res = await baidu.detect(filePath)
  if(res.error_code !== 0){
    fs.unlinkSync(filePath)
  }
  return { baidu: res, fileName: nowFileName}
}

// 开门记录
exports.openRecord = async (base64) => {
  let response ={
    business: {},
    baidu: {}
  }
  let result = await baidu.search(base64)
  let res = result.data
  // console.log('人脸搜索结果', res)
  if(res.error_code === 0){
    // 选出相似度最高的人
    let user = await cuccessfulCalculation(res.result.user_list)
    console.log('计算识别结果', user)
    // 邀约表查询
    if(user.group_id === '3'){
      response.business =  await visitorRecognition(user)
    }
    // 人员表查询
    if(user.group_id === '0'){
      // console.log('人员表查询开始')
      response.business = await employeeRecognition (user)
    }
  }
  response.baidu = res
  console.log('识别结果', response)
  return response
}

// 离开记录
exports.outRecord = async (base64) => {
  let response ={
    person : {},
    business: {},
    baidu: {}
  }
  let result = await baidu.search(base64)
  let res = result.data
  console.log('人脸搜索结果', res)
  if(res.error_code === 0){
    // 选出相似度最高的人
    let user = await cuccessfulCalculation(res.result.user_list)
    // 邀约表查询
    if(user.group_id === 3){
      // 1、查询该条邀约记录
      // 2、设置签离时间。修改邀约状态
      // 3、更新邀约记录
    }
    // 人员表查询
    if(user.group_id === 0){
      // 2：签退  3：早退
      // 1、查询当天考勤记录
      // 2、没有则创建考勤记录
      //    2.1、判断签退类型
      //    2.2、设置设置签退时间，签退类型
      //    2.3、添加考情记录
      // 3、有则更新考勤记录
      //    3.1 判断签退类型
      //    3.2、设置设置签退时间，签退类型
      //    2.3、更新考情记录
    }
  }
  response.baidu = res
  console.log('识别结果', response)
  return response
}
