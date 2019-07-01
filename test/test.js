
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/mongoose",{ useNewUrlParser: true });
mongoose.connection.once("open",function () {
  console.log("数据库连接成功~~~");
});
const Schema =mongoose.Schema

const departmentSchema = new Schema({
  id: String, //部门编号
  name: String //名称
});

const employeeSchema = new Schema({
  id: Number, //工号
  name: String, //姓名
  sex: Number, //性别
  age: Number, //年龄
  dep: {
    type: Schema.Types.ObjectId,
    ref: 'department'
  }
});

let department = mongoose.model('department', departmentSchema);
let employee = mongoose.model("employee", employeeSchema);



employee.find({})
  .populate('dep','_id')
  .exec(function(err, obj) {
    console.log('错误',err)
    console.log('数据',obj)
  });



// const classSchema = mongoose.Schema({
//   classNum: Number,       // 班级号
//   teacherName: String,   //班主任名字
//   teacherTel: Number,    // 班主任电话
//   classRemarks: String,   // 班级备注
// });
//
//
// const stuSchema = mongoose.Schema({
//   num: Number,      // 学号 必填
//   name: String,     // 姓名
//   class:{           // 班级 必填
//     type: Schema.Types.ObjectId,
//     ref: 'classEntity'
//   },
//   sex: Number,      // 性别
//   tel: Number,
// });
// let classEntity = mongoose.model('classes', classSchema);
// let studentEntity = mongoose.model('student', stuSchema);

