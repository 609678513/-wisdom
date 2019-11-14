// import moment from 'moment'
// import * as enums from '../enums'

// const {messageEmitter} = require('./messageController')
// const mongoose = require('mongoose')
// const dbHelper = require('../dbhelper/dbHelper')
// const agreedRecordHelper = require('../dbhelper/agreedRecordHelper')

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
  console.log('这是我们的filter', filter)
  return AgreedRecord.findOneAndUpdate(filter, body, options)
}


// exports.findDistinct = async (query) => {
//   return agreedRecordHelper.findDistinct(query.field, query.params)
// }

// exports.aggregateByPerson = async (personId, params) => {
//   let only = {
//     name: '$name',
//     tel: '$tel'
//   }
//   if (parseInt(params.recordType) === 0) { // 预约
//     only.name = '$employeeName'
//     only.tel = '$employeeTel'
//   }
//   let query = [{
//     $match: {
//       recordType: parseInt(params.recordType),
//       deleted: false,
//       sponsor: mongoose.Types.ObjectId(personId)
//     }
//   },
//     {
//       $sort: {
//         createTime: -1
//       }
//     },
//     {
//       $group: {
//         // 这里指定了name和tel为联合主键，相当于去重
//         _id: only,
//         origId: {
//           '$first': '$_id'
//         },
//         origCreateTime: {
//           '$first': '$createTime'
//         },
//         origSponsor: {
//           '$first': '$sponsor'
//         },
//         origRecipient: {
//           '$first': '$recipient'
//         },
//         origRecipientName: {
//           '$first': '$recipientName'
//         },
//         origRecipientTel: {
//           '$first': '$recipientTel'
//         }
//       }
//     },
//     {
//       $sort: {
//         origCreateTime: -1
//       }
//     },
//     {
//       $limit: 5
//     }
//   ]
//   return agreedRecordHelper.aggregate(query)
// }

// exports.findOne = async (query) => {
//   let populate = [
//     {
//       path: 'sponsor',
//       populate: [{path: 'department'}]
//     },
//     {
//       path: 'recipient',
//       populate: [{path: 'department'}]
//     },
//     {path: 'reviewer'},
//     {path: 'address'},
//     {path: 'followPeople'},
//     {path: 'vehicle'},
//     {
//       path: 'receptionist',
//       populate: [{path: 'department'}]
//     }
//   ]
//   return dbHelper.findOne(model, query, populate)
// }

exports.add = async (agreedRecord) => {
  console.log('新加的东西', agreedRecord)
  return AgreedRecord.create(agreedRecord)
}

// exports.update = async (filter, body) => {
//   let docOld = ''
//   let doc = ''
//   try {
//     docOld = await dbHelper.findOne(model, filter)
//     doc = await dbHelper.findOneAndUpdate(model, filter, body, {new: false})
//     doc.agreementDate.agreementTime = moment(doc.agreementDate.start).format('YYYY-MM-DD ') + enums.AGREEMENT_TIME[doc.agreementDate.type]
//     if (body.status == doc.status) {
//       // 前后状态一致，不再发送消息
//       return doc
//     }
//     messageEmitter.emit('dbCRUD', {model: 'agreedRecord', operation: '_update', body: doc})
//   } catch (err) {
//     if (doc && docOld) {
//       // redis 出错，回滚，否则数据库出错
//       await dbHelper.findOneAndUpdate(model, filter, docOld)
//     }
//     throw err
//   }
//   return doc
// }
//
// exports.del = async (filter) => {
//   return dbHelper.update(model, filter, {
//     deleted: true
//   })
// }
//
// exports.updateMany = async (body) => {
//   return dbHelper.updateMany(model, body.filter, body.doc)
// }


exports.pageQuery2 = async (filter, pagination = {page: 0, size: 10, sort: '_id'}, populate = '') => {
  console.log('邀约的关联查询777', populate)
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