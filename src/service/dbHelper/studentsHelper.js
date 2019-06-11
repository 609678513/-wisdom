require('../utils/dbConnection');
const Student = require('../Models/studentsEntity')

// exports.insertMany = async (arr) => {
//   return Student.insertMany(arr)
// }

 // Student.find({},function (err,data) {
//   if(!err){
//     console.log(data)
//   }
// });
// const arr1 =[
//   {
//     "num": 20202001,
//     "name": "张三",
//     "class": 2020051,
//     "sex": 0,
//     "tel": 123456789
//   },
//   {
//     "num": 20202002,
//     "name": "李四",
//     "class": 2020051,
//     "sex": 1,
//     "tel": 123456789
//   },
//   {
//     "num": 20202003,
//     "name": "王超逸",
//     "class": 2020051,
//     "sex": 0,
//     "tel": 123456789
//   },
//   {
//     "num": 20202004,
//     "name": "郭文闯",
//     "class": 2020051,
//     "sex": 1,
//     "tel": 123456789
//   },
//   {
//     "num": 20202005,
//     "name": "江峰",
//     "class": 2020051,
//     "sex": 1,
//     "tel": 123456789
//   },
//   {
//     "num": 20202006,
//     "name": "苔涛",
//     "class": 2020051,
//     "sex": 1,
//     "tel": 123456789
//   },
//   {
//     "num": 20202007,
//     "name": "韩坤",
//     "class": 2020051,
//     "sex": 1,
//     "tel": 123456789
//   },
//   {
//     "num": 20202008,
//     "name": "巩文华",
//     "class": 2020051,
//     "sex": 1,
//     "tel": 123456789
//   }
// ]
// Student.insertMany(arr1)
exports.addStu = async (arr) => {
   console.log('我执行了')
   return Student.insertMany(arr)
}


