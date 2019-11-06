
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const departmentSchema = mongoose.Schema({
  name: String,        // 部门名称 必填 唯一
  parent: {
    type: Schema.Types.ObjectId, ref: 'Department'
  },                  // 上级部门
  level: Number,       // 等级
  sort: Number,       // 排序
  deleted: {
    type: Boolean,
    default: false
  }                    // 是否删除
})


var Department = mongoose.model('Department', departmentSchema)

module.exports = Department
