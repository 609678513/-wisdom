
require('../utils/dbConnection');
require('../Models/agreedRecordEntity');

const AgreedRecord = require('../Models/agreedRecordEntity')


exports.find = async (query, populate = '', sort = {'createTime': -1}) => {
  return await AgreedRecord.find(query).populate(populate).sort(sort)
}

exports.findOne = async (filter, populate = '') => {
  let filterCopy = filter
  filterCopy.deleted = false
  return await AgreedRecord.findOne(filterCopy).populate(populate)
}

exports.findOneAndUpdate = async (filter, body, options = {new: true}) => {
  // console.log('这是我们的filter', filter)
  filter.deleted = false
  return AgreedRecord.findOneAndUpdate(filter, body, options)
}

exports.add = async (agreedRecord) => {
  // console.log('新加的东西', agreedRecord)
  return AgreedRecord.create(agreedRecord)
}

exports.pageQuery2 = async (filter, pagination = {page: 0, size: 10, sort: '_id'}, populate = '') => {
  // console.log('邀约的关联查询777', populate)
  const Model = AgreedRecord
  pagination.page = parseInt(pagination.page)
  pagination.size = parseInt(pagination.size)
  var start = (pagination.page) * pagination.size
  const [count, records] = await Promise.all([
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
      isFirstPage: pagination.page === 0,    // 是否是开头页,
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