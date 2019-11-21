// import Router from 'koa-router'
const router = require('koa-router')()
const agreedRecordController = require('../controller/agreedRecordController')

router.prefix('/agreedRecord')


// router.get('/inviteStatus', async (ctx) => { // 查询邀约列表排序待审核表头
//   ctx.body = await agreedRecordController.findRecords(ctx.query)
// })

router.get('/', async (ctx) => {
  console.log('这是邀约列表', ctx.query)
  ctx.body = await agreedRecordController.find(ctx.query)
})

router.get('/:_id', async (ctx) => {
  console.log('这是邀约ID', ctx.params)
  ctx.body = await agreedRecordController.findOne(ctx.params)
})

// 添加单条邀约接口
router.post('/invitedRecord', async (ctx) => { // 添加单条邀约接口
  console.log('添加单条邀约', ctx.request.body)
  ctx.body = await agreedRecordController.addInvitationRecord(ctx.request.body)
})


router.put('/', async (ctx) => {
  console.log('邀约更新', ctx.request.body)
  ctx.body = await agreedRecordController.update(ctx.request.body)
})

router.put('/cancleInvite', async (ctx) => {
  console.log('邀约取消', ctx.request.body)
  ctx.body = await agreedRecordController.cancleInvite(ctx.request.body)
})


router.delete('/:_id', async (ctx) => { // 假删除接口
  ctx.body = await agreedRecordController.del(ctx.params)
})

// 邀约微信小程序无图片接口
router.post('/invitationRecordWithOutPic', async (ctx) => { // 添加单条邀约接口
  if (ctx.request.body.address) {
    ctx.request.body.address = JSON.parse(ctx.request.body.address)
  }
  if (ctx.request.body.agreementDate) {
    ctx.request.body.agreementDate = JSON.parse(ctx.request.body.agreementDate)
  }
  ctx.body = await agreedRecordController.addInvitationRecord(ctx.request.body)
})

router.get('/invitationRecords', async (ctx) => { // 邀约查询接口
  ctx.query['recordType'] = 1
  ctx.body = await agreedRecordController.findRecords(ctx.query)
})

// 添加预约接口无图片
router.post('/reservationRecordWithOutPic', async (ctx) => { // 添加预约接口
  ctx.body = await agreedRecordController.addReservationRecord(ctx.request.body)
})

// 完善邀约记录的访客信息
router.put('/complete/:_id', async (ctx) => {
  ctx.body = await agreedRecordController.completeVisitorWithFollowers(ctx.params, ctx.request.body)
})

router.get('/reservationRecords', async (ctx) => { // 预约查询接口
  ctx.query['recordType'] = 0
  ctx.body = await agreedRecordController.findRecords(ctx.query)
})

router.get('/findInvitationPerson/:sponsor', async (ctx) => { // 邀约历史查询接口
  ctx.body =  await agreedRecordController.aggregateByPerson(ctx.params.sponsor, {recordType: 1})
})

router.get('/records', async (ctx) => { // 查询接口
  ctx.body = await agreedRecordController.findRecords(ctx.query)
})

router.get('/invitationRecord/:_id', async (ctx) => { // 邀预约详情查询接口
  ctx.body = await agreedRecordController.findInvitationRecord(ctx.params._id)
})

router.get('/reservationRecord/:_id', async (ctx) => { // 邀预约详情查询接口
  ctx.body = await agreedRecordController.findInvitationRecord(ctx.params._id)
})

router.get('/findReservationPerson/:sponsor', async (ctx) => { // 预约历史查询接口
  let records = await agreedRecordController.aggregateByPerson(ctx.params.sponsor, {recordType: 0})
  let res = []
  records.forEach(record => {
    if (record.recipient.name === record.recipientName && record.recipient.tel === record.recipientTel) {
      res.push(record)
    }
  })
  ctx.body =  res
})

// 保存接待人员
router.put('/saveReceptionist', async (ctx) => {
  ctx.body = await agreedRecordController.saveReceptionist(ctx.request.body)
})


module.exports = router