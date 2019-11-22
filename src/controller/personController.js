
// const xlsx = require("node-xlsx")
const assert = require('assert')
const personHelper = require("../service/dbHelper/personHelper")
const departmentHelper = require("../service/dbHelper/personHelper")
const departmentController = require("./departmentController")
const baidu  = require('../thirdparty/controller/BaiDuFaceRecognition')

async function personFilterCopyUtil (param) {
  let obj = {deleted: false}
  if (param) {
    if (param._id) {
      obj._id = param._id
    }
    if (param.email) {
      obj.email = param.email
    }
    if (param.name) {
      obj.name = param.name
    }
    if ('roles' in param) {
      obj.role = param.roles
    }
    if ('gender' in param) {
      obj.gender = param.gender
    }
    if ('type' in param) {
      obj.type = param.type
    }
    if ('subType' in param) {
      obj.subType = param.subType
    }
    if ('certificateType' in param) {
      obj.certificateType = param.certificateType
    }
    if (param.certificateNumber) {
      obj.certificateNumber = param.certificateNumber
    }
    if (param.tel) {
      obj.tel = param.tel
    }
    if (param.email) {
      obj.email = param.email
    }
    if (param.position) {
      obj.position = param.position
    }
    if (param.employeeNumber) {
      obj.employeeNumber = param.employeeNumber
    }
    if ('entryState' in param) {
      obj.entryState = param.entryState
    }
    if (param.wxOpenid) {
      obj.wxOpenid = param.wxOpenid
    }
    if (param.wxPublicOpenid) {
      obj.wxPublicOpenid = param.wxPublicOpenid
    }
    if (param.tpFrId) {
      obj.tpFrId = param.tpFrId
    }
    if (param.watcherEmployee) {
      obj.watcherEmployee = param.watcherEmployee
    }
    if ('searchContent' in param) {
      param.type = parseInt(param.type)
      if (param.type === 0) {
        obj.$or = [
          {name: {$regex: param.searchContent, $options: '$i'}},
          {employeeNumber: {$regex: param.searchContent, $options: '$i'}},
          {tel: {$regex: param.searchContent, $options: '$i'}}
        ]
        // logger.debug('员工搜索 obj.$or',obj.$or)
      } else {
        obj.$or = [
          {name: {$regex: param.searchContent, $options: '$i'}},
          {employeeNumber: {$regex: param.searchContent, $options: '$i'}},
          {tel: {$regex: param.searchContent, $options: '$i'}}
        ]
        // logger.debug('访客搜索 obj.$or',obj.$or)
      }
    }
    if ('receptionist' in param) {
      obj.$or = [
        {name: {$regex: param.receptionist, $options: '$i'}},
      ]
    }
    if (param.department) {
      obj.department = {$in: await departmentController.findIdListIncludeChildren(param.department)}
    }
    if (param.$or) {
      obj.$or = param.$or
    }
    if (param.$and) {
      obj.$and = param.$and
    }
  }
  return obj
}

async function verifyPersonFieldDuplicated (person) {
  // console.log('判断有执行啊' , person.certificateNumber)
  // 重复性校验-证件号
  if (person.certificateNumber) {
    let personOldByCertificateNumber = await personHelper.findOne({
      deleted: false,
      certificateNumber: person.certificateNumber
    })
    assert(!personOldByCertificateNumber, '该证件号已存在')
    // assert(personOldByCertificateNumber, '该证件号已存在')
  }
  // 重复性校验-手机号
  if (person.tel) {
    let personOldByTelNumber = await personHelper.findOne({
      deleted: false,
      tel: person.tel
    })
    // console.log('判断查询结果' , !personOldByTelNumber)
    assert(!personOldByTelNumber, '该手机号已存在')
  }
  // 重复性校验-工号
  if (person.employeeNumber) {
    let personOldByEmployeeNumber = await personHelper.findOne({
      deleted: false,
      employeeNumber: person.employeeNumber,
      type: parseInt(person.type)
    })
    assert(!personOldByEmployeeNumber, '该工号已存在')
  }
}

async function update_verifyPersonFieldDuplicated (person) {
  console.log('判断有执行啊' , person.certificateNumber)
  // 重复性校验-证件号
  if (person.certificateNumber) {
    let personOldByCertificateNumber = await personHelper.findOne({
      deleted: false,
      certificateNumber: person.certificateNumber
    })
    assert(!personOldByCertificateNumber || personOldByCertificateNumber._id.toString() === person._id.toString(), '该证件号已存在')
  }
  // 重复性校验-手机号
  if (person.tel) {
    let personOldByTelNumber = await personHelper.findOne({
      deleted: false,
      tel: person.tel
    })
    console.log('判断查询结果' , !personOldByTelNumber)
    assert(!personOldByTelNumber || personOldByTelNumber._id.toString() === person._id.toString(), '该手机号已存在')
  }
}

exports.findAll = async (params) => {
  console.log('到达控制层', params)
  let filter = await personFilterCopyUtil(params)
  console.log('到达控制层2', filter)
  // let filter = params
  // logger.debug('[人员] [查询]', filter)
  return await personHelper.find(filter, 'department')
},
exports.findPageQuery = async (ctx) => {
  console.log( 'agagag',ctx.query.params)
  console.log( 'agagag',ctx.query.page)
  return await personHelper.findPopulate(ctx.query.params,ctx.query.page)
}

exports.findOne = async (filter) => {
  return personHelper.findOne(filter, 'department')
},

exports.add = async (person) => {
  // // 3 判断是否存在同证件号的访客
  if (person.type === 0) { // 如果添加的人员是在职员工,需要进行访客升级员工判断
    await verifyPersonFieldDuplicated(person)
    let resPerson =  await personHelper.add(person)
    if(resPerson.photo){
      let res = await baidu.add(resPerson)
      console.log('人脸注册结果', res.data)
    }
    return resPerson
  } else {
    await verifyPersonFieldDuplicated(person)
    let resPerson =  await personHelper.add(person)
    return resPerson
    // if(resPerson.photo){
    //   let res = await baidu.add(resPerson)
    //   console.log('人脸注册结果', res.data)
    // }
  }
}

exports.del =  async (_id) => {
  return await personHelper.del({_id: _id, deleted: false})
}

exports.update =  async  (person)  => {
  await update_verifyPersonFieldDuplicated(person)
  let resPerson = await personHelper.updateOne({_id: person._id}, person)
  if(resPerson.ok && person.photo){
    let res = await baidu.update(person)
    console.log('人脸更新结果', res.data)
  }
  return resPerson
}

exports.findPage = async ({filter = {}, pagination}) => {
  // console.log('到控制层')
  filter.deleted = false
  if (filter.searchContent) {
    if (filter.$or) {
      filter.$and = [{$or: filter.$or}]
    }
    filter.$or = []
    if (filter.type === 3) {
      filter.$or.push({name: {$regex: filter.searchContent, $options: '$i'}})
      filter.$or.push({tel: {$regex: filter.searchContent, $options: '$i'}})
    } else {
      filter.$or.push({name: {$regex: filter.searchContent, $options: '$i'}})
      filter.$or.push({employeeNumber: {$regex: filter.searchContent, $options: '$i'}})
      filter.$or.push({tel: {$regex: filter.searchContent, $options: '$i'}})
    }
    delete filter.searchContent
  }
  if (filter.department) {
    filter.department = {$in: await departmentController.findIdListIncludeChildren(filter.department)}
  }
  // if (filter.isPhoto === 0) {
  //   filter.photo = {'$exists': false}
  // } else if (filter.isPhoto === 1) {
  //   filter.photo = {'$exists': true}
  // }
  // delete filter.isPhoto
  // if (filter.roles) {
  //   filter.roles = {'$in': filter.roles}
  // }
  // let result = await dbHelper.pageQuery3('person', filter, pagination, 'department employeeFactory roles')
  // console.log('控制层查人开始')
  let result = await personHelper.pageQuery3(filter, pagination, 'department')
  // console.log('到控制层返回', result)
  return result
}







