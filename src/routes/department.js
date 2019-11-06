/**
 * @create by SNOW 2018.10.10
 */
const router = require('koa-router')()
const departmentController= require('../controller/departmentController')

router.prefix('/department')

router.get('/', async (ctx) => {
  ctx.body = await departmentController.findPage(ctx.query.params ? ctx.query.params : {})
})

router.get('/depart', async (ctx) => {
  ctx.body = await departmentController.find(ctx.query.params)
})

router.get('/tree', async (ctx) => {
  // console.log('查找树')
  ctx.body = await departmentController.findDepartmentTree(ctx.params)
})

router.get('/:_id', async (ctx) => {
  ctx.body = await departmentController.findOne(ctx.params)
})

router.post('/', async (ctx) => {
  ctx.body = await departmentController.add(ctx.request.body)
})

router.put('/', async (ctx) => {
  ctx.body = await departmentController.update(ctx.request.body)
})

router.delete('/:_id', async (ctx) => {
  try {
    ctx.body = await departmentController.delete(ctx.params)
    // logger.debug('[人员] [查询] [分页]', ctx.body)
  } catch (e) {
    // console.log('[人员] [查询] [分页]', e)
    ctx.status = 406
    ctx.body = e.toString()
  }

})

module.exports = router
