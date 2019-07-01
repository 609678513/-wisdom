
const mongoose = require('mongoose')
const classSchema = mongoose.Schema({
  classNum: String,       // 班级号
  teacherName: String,   //班主任名字
  teacherTel: Number,    // 班主任电话
  classRemarks: String,   // 班级备注
  deleted: {                      // 是否删除
    type: Boolean,
    default: false
  }
});

var classEntity = mongoose.model('classes', classSchema);

module.exports = classEntity;
