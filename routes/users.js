const router = require('koa-router')()

router.prefix('/upload')

router.post('/', function (ctx, next) {
  console.log('我是请求哦',ctx.request.files)
  ctx.body = 'this is a 文件上传!'
})

router.get('/', function (ctx, next) {
    console.log('我是请求额',ctx.request.body.files)
    ctx.body = 'this is a users haha!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
