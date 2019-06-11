
const mongoose = require('mongoose')
const stuSchema = mongoose.Schema({
  num: Number,      // 学号 必填
  name: String,     // 姓名 必填Class: String,
  class: Number,    // 班级
  sex: Number,      // 设备型号 必填
  tel: Number,
});
// const stuSchema = mongoose.Schema({
//   name: String,     // 姓名 必填Class: String,
//   age: Number,
//   gender: {
//     type:String,
//     default:"female"
//   },    // 班级
//   address: String,      // 设备型号 必填
//
// });
var studentEntity = mongoose.model('student', stuSchema);

module.exports = studentEntity;
