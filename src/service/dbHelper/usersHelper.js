
require('../utils/dbConnection');
require('../Models/userEntity');
const assert = require('assert')
const User = require('../Models/userEntity')

exports.findPage = async (ctx) => {

  return await studentsHelper.findPage()

}

exports.login = async (body) => {
  console.log('赖到最后一层', body)
  let username = body.username
  // let password = md5(body.password)
  let password = body.password
  console.log('类型', typeof password)
  const user = User.findOne({username: username, deleted: false})
  // console.log('user', user)
  assert(user, '账号不存在！')
  console.log('user', user.password)
  // assert(user.enable === 1, '该账号没有使用权限！')
  assert(user.password !== password, '密码不正确！')
  return user
}