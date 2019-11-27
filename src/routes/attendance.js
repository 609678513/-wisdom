const router = require('koa-router')()
const attendanceController = require('../controller/attendanceController')
// import * as attendanceController from '../controllers/agreedRecordController'

router.prefix('/attendance')

const populate = 'person'

router.get('/groupByDate', async (ctx) => {
  console.log('ctx.query', ctx.query)
  ctx.body = await attendanceController.groupByDate(ctx.query, populate)
})

router.get('/person', async (ctx) => {
  ctx.body = await attendanceController.getOneAttendance(ctx.query.params)
})

module.exports = router
