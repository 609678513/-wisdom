const router = require('koa-router')()
const personController = require('../controller/personController')

router.prefix('/person')



router.get('/', async (ctx) => {
  // console.log('分页路由')
  // logger.debug('分页', ctx.query)
  try {
    ctx.body = await personController.findPage(ctx.query)
    // logger.debug('[人员] [查询] [分页]', ctx.body)
  } catch (e) {
    // console.log('[人员] [查询] [分页]', e)
    ctx.status = 406
    ctx.body = e.toString()
  }
})

router.get('/phone', async (ctx) => {
  console.log('电话查询员工', ctx.query)
  ctx.body = await personController.findOne(ctx.query)
})

router.get('/all', async (ctx) => {
  console.log('查询所有人', ctx.query)
  try {
    ctx.body = await personController.findAll(ctx.query)
  } catch (e) {
    ctx.status = 406
    ctx.body = e.toString()
  }
})

router.get('/:_id', async (ctx) => {
  ctx.body = await personController.findOne(ctx.params)
})

router.put('/', async (ctx) => {
  ctx.body = await personController.update(ctx.request.body)
})

router.post('/', async (ctx) => {
  try {
    ctx.body = await personController.add(ctx.request.body)
  } catch (e) {
    ctx.status = 406
    // console.log('我是添加错误', e.message)
    ctx.body = e.message
  }
})

router.delete('/:id', async (ctx) => {
  // console.log('删除路由', ctx.params)
  ctx.body = await personController.del(ctx.params.id)
})

module.exports = router
