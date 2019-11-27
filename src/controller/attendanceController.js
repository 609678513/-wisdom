const attendanceHelper = require("../service/dbHelper/attendanceHelper")


exports.groupByDate = async (params, populate) => {
  console.log('考勤控制层参数', params)
  let query = {}
  let page = {}
  if (params && params.time) {
    query['time'] = params.time
  } else {
    query['time'] = [moment().subtract(31, 'days').format('YYYY-MM-DD ') + '00:00:00', moment().add(1, 'days').format('YYYY-MM-DD ') + '00:00:00']
  }
  if (params && params.name) {
    query['name'] = params.name
  }
  if (params && params.department) {
    query['department'] = params.department
  }
  if (params && params.pSize) {
    page['pageSize'] = params.pSize
  }
  if (params && params.pIndex) {
    page['pageIndex'] = params.pIndex
  }
  console.log('服务层', query, page)
  return attendanceHelper.groupByDate(query, page, populate)
}