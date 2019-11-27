require('../utils/dbConnection');
require('../Models/attendanceEntity');

const util = require('util')
const moment = require('moment')
const _ = require('lodash')
const personController = require('../../controller/personController')
const attendanceEntity = require('../Models/attendanceEntity')

exports.find = async (query, populate = '', sort = {'createTime': -1}) => {
  return await attendanceEntity.find(query).populate(populate).sort(sort)
}

exports.findOne = async (filter, populate = '') => {
  let filterCopy = filter
  // filterCopy.deleted = false
  return await attendanceEntity.findOne(filterCopy).populate(populate)
}

exports.findOneAndUpdate = async (filter, body, options = {new: true}) => {
  // console.log('这是我们的filter', filter)
  return attendanceEntity.findOneAndUpdate(filter, body, options)
}

exports.add = async (attendance) => {
  // console.log('新加的东西', agreedRecord)
  return attendanceEntity.create(attendance)
}


//根据人员信息查询，显示每天最早时间与最晚时间
exports.groupByDate = async (params = {
  time: [moment().subtract(31, 'days').format('YYYY-MM-DD ') + '00:00:00', moment().add(1, 'days').format('YYYY-MM-DD ') + '00:00:00']
}, page = {
  pageSize: 10,
  pageIndex: 1,
  sort: 'createTime'
}, populate = 'person') => {
  const Model = attendanceEntity
  let tempTime = moment(new Date(params.time[0]))
  let dateArray = []
  while (tempTime.valueOf() < new Date(params.time[1]).getTime()) {
    dateArray.push('' + tempTime)
    tempTime = tempTime.add(1, 'days')
  }
  let people = []
  let query = {
    'type': 0
  }
  if (params.department) {
    query['department'] = params.department
  }
  if (params.name) {
    params.name = params.name.split('').map(function (n, i) {
      if (n === '*') {
        return '\\*'
      } else {
        return n
      }
    }).join('')
    // const reg = new RegExp(params.name, 'i')
    query['$or'] = [{'employeeNumber': {$regex: params.name, $options: '$i'}}, {
      'name': {
        $regex: params.name,
        $options: '$i'
      }
    }]
  }
  console.log('服务层参数', query)
  people = await personController.find(query)
  console.log('服务层参数查询结果', people)
  let count = people.length
  //排序
  people = _.sortBy(people, function (o) {
    return o.employeeNumber
  })
  if (page.pageSize !== -1) {
    people = people.slice((page.pageIndex - 1) * page.pageSize, page.pageSize * page.pageIndex)
  }
  const [records] = await Promise.all([
    // 查询数量
    // 查询一页的记录
    Model.find({
      "createTime": {
        $gte: moment(new Date(params.time[0])).subtract(1, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
        $lte: params.time[1]
      },
      'person': {
        '$in': people.map(function (p) {
          return p._id
        })
      }
    })
      .sort(page.sort)
  ])
  let results = []
  let index = 1
  people.forEach((p) => {
    const onObj = {
      person: p._id,
      name: p.name,
      department: p.department.name,
      employeeNumber: p.employeeNumber,
      index: index
    }
    const offObj = {
      person: p._id,
      name: p.name,
      department: p.department.name,
      employeeNumber: p.employeeNumber,
      index: index
    }
    dateArray.forEach(d => {
      onObj[d] = ''
      offObj[d] = ''
    })
    onObj.timeType = '上班'
    results.push(onObj)
    offObj.timeType = '下班'
    results.push(offObj)
    index = index + 1
  })
  results.forEach((res) => {
    records.forEach((record) => {
      if (util.isDeepStrictEqual(res.person, record.person)) {
        let time = new Date(record.createTime.substring(0, 10) + ' 00:00:00').getTime() + ''
        if (res[time] !== undefined && res.timeType === '上班' && record.firstEntryTime) {
          res[time] = record.firstEntryTime.substring(10, 19)
        }
        if (res[time] !== undefined && res.timeType === '下班' && record.lastOutTime) {
          res[time] = record.lastOutTime.substring(10, 19)
        }
      }
    })
  })
  // console.log('results', results)
  return {
    count: count,
    results: results
  }
}
