
require('../utils/dbConnection');
require('../Models/classEntity')
const Student = require('../Models/studentsEntity')
const assert = require('assert')

exports.find= async (filter) => {
  console.log('条件查询',filter)
  return await Student.find(filter)
}

exports.findOne= async (id, populate = 'class') => {
  console.log('传入类型',typeof id);
  return student = await Student.findOne({'_id': id}).populate(populate)
}

// exports.import = async (arr) => {
//    console.log('我执行了')
//    return Student.insertMany(arr)
// }
exports.import = async (arr) => {
  console.log('我执行了',arr)
  Student.create({arr,function (err) {
    if(err){
      console.log(err);
      return err
    }else {
      console.log("插入成功~~~");
      return '插入成功~~~'
    }
  }})


}

exports.login = async (filter,tel) => {
  const student = await Student.findOne(filter)
  assert(student, '学生不存在！')
  assert(student.tel === tel, '电话不正确！')
  return student
}

exports.updateStuOne = async (filter,body) => {
  console.log('这是修改单个对象：',body)
  const student = await Student.updateOne(filter,body)
  assert(student, '修改失败！')
  return student
}

exports.findPopulate = async (params, page = {pageSize: 3, pageIndex: 1}, populate = 'class') => {
  console.log( 'qweqeqw',params)
  console.log( 'qweqwe',page)
  var start = (page.pageIndex - 1) * page.pageSize
  const [count, records] = await Promise.all([
    // 查询数量
    Student.countDocuments(params),
    // 查询一页的记录
    Student.find(params)
      .skip(start)
      .limit(page.pageSize)
      .populate(populate)
      // .sort(page.sort)
  ])
  let totalPages = parseInt(count / page.pageSize) + ((count % page.pageSize !== 0) ? 1 : 0)
  return {
    pageNumber: page.pageIndex,
    pageCount: Math.ceil(count / page.pageSize),
    totalCount: count,
    totalPages: totalPages,
    results: records
  }
}