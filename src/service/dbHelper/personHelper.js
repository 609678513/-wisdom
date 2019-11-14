
require('../utils/dbConnection');
require('../Models/departmentEntity')
const Person = require('../Models/personEntity')
const assert = require('assert')


exports.add = async (person) => {
  console.log('新加的东西', person)
  return Person.create(person)
}

exports.find = async (query, populate = '', sort = {'createTime': -1}) => {
  // console.log('正式查询', query)
  let res = await Person.find(query).populate(populate).sort(sort)
  // console.log('正式查询结果', res)
  return res
}

exports.findOne = async (filter, populate = '') => {
  let filterCopy = filter
  filterCopy.deleted = false
  return await Person.findOne(filterCopy).populate(populate)
},

exports.updateOne =  async (filter, person) => {
  // console.log('控制层到了', filter)
  let personOld = await Person.findOne(filter)
  assert(personOld, '该人员不存在')
  let res = await Person.updateOne(filter, person)
  console.log('更新的人', res)
  return res
},

exports.del =  async (filter) => {
    // console.log('控制层到了', filter)
    let person = await Person.findOne(filter)
    assert(person, '该人员不存在')
    person.deleted = true
    delete person._id
    return Person.updateOne(filter, person)
},

exports.import = async (arr) => {
  // console.log('我执行了',arr)
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

// exports.updateStuOne = async (filter,body) => {
//   console.log('这是修改单个对象：',body)
//   const student = await Student.updateOne(filter,body)
//   assert(student, '修改失败！')
//   return student
// }

// exports.findPopulate = async (params, page = {pageSize: 3, pageIndex: 1}, populate = 'class') => {
//   // console.log( 'qweqeqw',params)
//   // console.log( 'qweqwe',page)
//   var start = (page.pageIndex - 1) * page.pageSize
//   const [count, records] = await Promise.all([
//     // 查询数量
//     Student.countDocuments(params),
//     // 查询一页的记录
//     Student.find(params)
//       .skip(start)
//       .limit(page.pageSize)
//       .populate(populate)
//       // .sort(page.sort)
//   ])
//   let totalPages = parseInt(count / page.pageSize) + ((count % page.pageSize !== 0) ? 1 : 0)
//   return {
//     pageNumber: page.pageIndex,
//     pageCount: Math.ceil(count / page.pageSize),
//     totalCount: count,
//     totalPages: totalPages,
//     results: records
//   }
// }
 // 分页查询
exports.pageQuery3 = async (filter, pagination = {page: 1, size: 10, sort: 'name'}, populate = '') => {
  console.log('执行到这里', filter)
  // return await Person.find()
  const Model = Person
  pagination.page = parseInt(pagination.page) - 1
  pagination.size = parseInt(pagination.size)
  var start = (pagination.page) * pagination.size
  let [count, records] = await Promise.all([
    // 查询数量
    Model.countDocuments(filter),
    // 查询一页的记录
    Model.find(filter)
      .skip(start)
      .limit(pagination.size)
      .populate(populate)
      .sort(pagination.sort)
  ])
  let isLast = (count - (start + records.length)) <= 0
  let totalPages = parseInt(count / pagination.size) + ((count % pagination.size !== 0) ? 1 : 0)
  return {
    pagination: {
      isFirstPage: pagination.page === 1,    // 是否是开头页,
      isLastPage: isLast,     // 是否是最后一页
      totalPages: totalPages,     // 所有页数
      totalElements: count,  // 所有个数
      page: pagination.page,           // 当前是第多少页
      size: pagination.size,// 每页大小
      number: records.length          // 当前页数量
    },
    results: records
  }
}