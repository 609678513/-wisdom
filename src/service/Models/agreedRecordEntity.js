const mongoose = require('mongoose')
const Schema = mongoose.Schema

const agreedRecordSchema = mongoose.Schema({
  name: {  // 访客姓名
    type: String,
    required: true
  },
  tel: {  // 访客电话
    type: String,
    required: true
  },
  agreementDate: { // 约定时间 {start：'2018-01-09 00:00:00', end: '2018-01-09 23:00:00', type：0, time: date()时间点 }
    type: Schema.Types.Mixed,
    required: true
  },
  // address: { // 约定地址
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Area'
  // },
  agreementCause: { // 约定事由
    type: Number,
    required: true
  },
  remark: { // 备注
    type: String
  },
  deleted: {
    type: Boolean, // 删除标识 true：已删除，false：未删除
    default: false,
    required: true
  },
  status: { // 查看api枚举类
    type: Number,
    default: 0,
    required: true
  },
  sponsor: { // 约定发起人 邀约时的员工
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  recipient: { // 约定接收人 邀约时的访客
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  receptionist: { // 接待人员
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  receptionRemark: { // 接待需求
    type: String
  },
  // type: Number,
  // reviewer: { // vip邀约审核人
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Person'
  // },
  certificateType: {
    type: Number,
    default: 0
  }, // 证件类型 0身份证 1护照
  certificateNumber: String, // 证件号码
  company: String, // 公司
  position: String, // 职位
  photo: String, // 照片
  closeReason: { // 取消原因
    type: String
  },
  closeTime: { // 取消时间
    type: String
  },
  createTime: { // 创建时间
    type: String
  },
  updateTime: { // 更新时间
    type: String
  },
  // invalidTime: { // 失效时间
  //   type: String
  // },
  endTime: {
    type: String // 离开时间
  },
  leaveRemark: { // 离开备注
    type: String
  },
  arrivalTime: { // 抵达时间
    type: String
  }
  // blacklisted: {
  //   type: Boolean,
  //   default: false
  // },
})

var AgreedRecord = mongoose.model('agreedRecords', agreedRecordSchema)

module.exports = AgreedRecord