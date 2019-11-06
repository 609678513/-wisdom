
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const personScheme = mongoose.Schema({
  type: Number,             // 人员类型
  name: String,             // 姓名
  gender: Number,           // 性别
  certificateType: Number,  // 证件类型
  certificateNumber: String, // 证件号码
  tel: String,              // 联系电话
  photo: String,            // 识别照片
  // roles: [{type: Schema.Types.ObjectId, ref: 'Role'}], // 人员角色
  department: {type: Schema.Types.ObjectId, ref: 'Department'}, // 部门
  company: String,          // 公司
  position: String,         // 职位
  employeeNumber: String,   // 工号
  // employeeFactory: {type: Schema.Types.ObjectId, ref: 'Area'},   // 厂区
  entryDate: Date,          // 入职时间
  birthday: Date,           // 出生日期
  address: String,          // 住址
  remark: String,           // 备注
  updateUser: String,       // 更新人
  updateTime: Date,         // 更新时间
  deleted: {type: Boolean, default: false},       //是否已删除
});

var personEntity = mongoose.model('person', personScheme);

module.exports = personEntity;
