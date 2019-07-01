
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/mongoose_test",{ useNewUrlParser: true });
mongoose.connection.once("open",function () {
  console.log("数据库连接成功~~~");
});
const Schema =mongoose.Schema

const classSchema = new Schema({
  classNum: Number,       // 班级号
  teacherName: String,   //班主任名字
  teacherTel: Number,    // 班主任电话
  classRemarks: String,   // 班级备注
});

const stuSchema = new Schema({
  num: Number,      // 学号 必填
  name: String,     // 姓名
  class:{           // 班级 必填
    type: Schema.Types.ObjectId,
    ref: 'classes'
  },
  sex: Number,      // 性别
  tel: Number,
});
let classEntity = mongoose.model('classes', classSchema);
let studentEntity = mongoose.model('student', stuSchema);

studentEntity.find({})
  .populate('class')
  .exec(function(err, obj) {
    console.log('错误',err)
    console.log('数据',obj)
  });
