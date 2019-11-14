
require('../utils/dbConnection');
require('../Models/userEntity');
const assert = require('assert')
const User = require('../Models/userEntity')

exports.findPage = async (ctx) => {
  return await studentsHelper.findPage()
}

exports.add = async (user) => {
  return await User.create(user)
}

exports.findOne = async (query, populate = '') => {
  return User.findOne(query).populate(populate)
}

exports.findOneAndUpdate = async (filter, body, options = {new: true}) => {
  console.log('删除用kiash')
  return await User.findOneAndUpdate(filter, body, options)
}

exports.login = async (body) => {
  console.log('赖到最后一层', body)
  // let username = body.username
  // let password = md5(body.password)
  // let password = body.password
  let filter ={
    username:body.username,
    deleted: false
  }
  // console.log('类型', typeof username)
  let userNow = await User.findOne(filter)
  assert(userNow, '账号不存在！')
  assert(userNow.enable, '该账号没有使用权限！')
  assert(!(userNow.password !== body.password), '密码不正确！')
  return userNow
}

exports.query = async (query) => {
  if (query.page) {
    console.log('用户的关联查询', query.populate)
    return exports.pageQuery(query.params, query.page, query.populate)
  } else {
    return await exports.find2(query.params, query.projection)
  }
}

exports.find2 = async (query, projection, populate = '') => {
  let res = User.find(query, projection).populate(populate).sort({updateTime: '-1'})
  return res

}

exports.pageQuery = async (params, page = {pageSize: 10, pageIndex: 1, sort: '_id'}, populate = 'department') => {
  console.log('用户的关联查询777', populate)
  const Model = User
  var start = (page.pageIndex - 1) * page.pageSize
  const [count, records] = await Promise.all([
    // 查询数量
    Model.countDocuments(params),
    // 查询一页的记录
    Model.find(params)
      .skip(start)
      .limit(page.pageSize)
      .populate(populate)
      .sort(page.sort)
  ])
  return {
    pageNumber: page.pageIndex,
    pageCount: Math.ceil(count / page.pageSize),
    totalCount: count,
    results: records
  }
}

exports.update = async (filter, body) => {
  return User.update(filter, body)
}