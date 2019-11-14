const assert = require('assert')
const moment = require('moment')


const usersHelper = require('../service/dbHelper/usersHelper')

exports.findOne = async (query) => {
  query.deleted = false
  return await usersHelper.findOne(query, ['department'])
}

// exports.findPage = async (ctx) => {
//
//   return await studentsHelper.findPage()
//
// }

exports.update = async (user) => {

  // 1 验证用户是否存在
  assert(await usersHelper.findOne({
    _id: user._id,
    deleted: false
  }), '不存在该用户')

  // 2 验证用户名是否重复
  const userByName = await usersHelper.findOne({username: user.username, deleted: false})
  if (userByName && userByName._id.toString() !== user._id.toString()) {
    assert(!userByName, '用户名已存在')
  }

  // 3 更新用户信息
  return  await usersHelper.update({_id: user._id}, user)
}

exports.query = async (query) => {
  console.log('控制层', query)
  if (query && query.params.updateTime){
    query.params.updateTime = {
      $gte: query.params.updateTime[0],
      $lte: query.params.updateTime[1]
    }
  }
  if (query.page && query.params.name) {
    let reg = new RegExp(query.params.name)
    query.params['$or'] = [{'username': reg}, {'name': reg}, {'tel': reg}]
    delete query.params.name
  }
  let res = await usersHelper.query(query)
  console.log('控制层返回', res)
  return res
}

exports.queryByUserName = async (params) => {
   let res = await usersHelper.query({params: {username: {$regex: new RegExp(params.username, 'i')}}})
   return res

}

exports.add = async (user) => {
    return await usersHelper.add(user)
}

exports.delete = async (filter) => {
  const query = {
    _id: filter._id,
    deleted: false
  }
  let user = await usersHelper.findOne(query)
  assert(user, '用户不存在')
  user.deleted = true
  user.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  let res = await usersHelper.findOneAndUpdate(filter, user)
  return res
}

exports.login = async (body) => {
  console.log('控制层')
  let res = await usersHelper.login(body)
  console.log('控制层登陆返回', res)
  return res
}