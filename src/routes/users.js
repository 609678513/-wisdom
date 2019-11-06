
const rolesController = require('../controller/usersController')
const router = require('koa-router')()

router.prefix('/roles')

router.get('/', async (ctx) => {
  console.log('get请求口')
  return '呵呵'
})

router.post('/login', async (ctx) => {
  console.log('登陆服务端接口', ctx.request.body)
  ctx.body = await rolesController.login(ctx.request.body)
})


module.exports = router
