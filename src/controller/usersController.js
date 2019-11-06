

const usersHelper = require('../service/dbHelper/usersHelper')

exports.findPage = async (ctx) => {

  return await studentsHelper.findPage()

}

exports.login = async (body) => {
  console.log('控制层')
  return await usersHelper.login(body)
}