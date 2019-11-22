const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attendanceSchema = mongoose.Schema({
  firstType: Number, // 1 签到  0 迟到
  lastType: Number, //  1 签退  0 早退
  firstEntryTime: String,
  lastOutTime: String,
  person: {
    type: Schema.Types.ObjectId, ref: 'Person'
  },
  createTime: String
})

var Attendance = mongoose.model('Attendance', attendanceSchema)

module.exports = Attendance