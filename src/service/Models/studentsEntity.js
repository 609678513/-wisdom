
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stuSchema = mongoose.Schema({
  num: String,      // 学号 必填
  name: String,     // 姓名
  class:{           // 班级 必填
    type: Schema.Types.ObjectId,
    ref: 'classes'
  },
  sex: Number,      // 性别
  tel: String,
  deleted: {                      // 是否删除
    type: Boolean,
    default: false
  }
});

var studentEntity = mongoose.model('student', stuSchema);

module.exports = studentEntity;
