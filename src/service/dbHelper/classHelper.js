
require('../utils/dbConnection');
const Class = require('../Models/classEntity')
const assert = require('assert')

exports.find= async (filter) => {
  // console.log('filter124124',filter)
  return await Class.find(filter)
}

exports.findOne= async (filetr) => {
  return student = await Class.findOne(filetr)
}

exports.insertMany = async (arr) => {
   console.log('我执行了')
   return Class.insertMany(arr)
}




