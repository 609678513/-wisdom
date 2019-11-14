
const usersController = require('../controller/usersController')
const router = require('koa-router')()

router.prefix('/user')

router.get('/', async (ctx) => {
  console.log('列表请求', ctx.query)
  ctx.body = await usersController.query(ctx.query)
})


router.post('/', async (ctx) => {
  console.log('登陆服务端接口', ctx.request.body)
  ctx.body = await usersController.add(ctx.request.body)
  // ctx.body = await usersController.login(ctx.request.body)
})

router.post('/login', async (ctx) => {
  ctx.body = await usersController.login(ctx.request.body)
})

router.put('/', async (ctx) => {
  console.log('更新', ctx.request.body)
  ctx.body = await usersController.update(ctx.request.body)
})
router.get('/userName', async (ctx) => {
  // console.log('查询用户', ctx.query)
  ctx.body = await usersController.queryByUserName(ctx.query)
})

router.get('/:_id', async (ctx) => {
  console.log('详情', ctx.params)
  ctx.body = await usersController.findOne(ctx.params)
})


router.delete('/:_id', async (ctx) => {
  console.log('delete用户', ctx.params)
  ctx.body = await usersController.delete(ctx.params)
})

module.exports = router
