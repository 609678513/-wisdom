const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
  name: String,                   // 姓名
  tel: String,                    // 联系方式
  department: String,
  username: String,                // 用户名
  password: String,               // 密码
  person: String,                 // 关联人员
  role: {                         // 角色
    type: Schema.Types.ObjectId, ref: 'Role'
  },
  enable: Number,                 // 是否启用 0禁用 1启用
  deleted: {                      // 是否删除
    type: Boolean,
    default: false
  },
  remark: String,                 // 备注
  createTime: String,             // 创建时间
  updateTime: String,             // 更新时间
  createUser: String,             // 创建人
  updateUser: String              // 更新人
})

var User = mongoose.model('User', userSchema)

module.exports = User
