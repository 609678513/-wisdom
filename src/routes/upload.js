
const router = require('koa-router')()
const xlsx = require("node-xlsx")
const uploadController = require("../controller/uploadController")
router.prefix('/upload')

router.get('/', async (ctx) =>{
  ctx.body = 'this is a users haha!'
  // ctx.body = await stuController.findPageQuery(ctx)
})
// 照片上传
router.post('/', async (ctx) => {
  // console.log('请求来了', ctx.request.files.file)
  try {
    ctx.body = await uploadController.uploadPhoto(ctx.request.files.file)
  } catch (e) {
    // console.log(e)
    ctx.status = 406
    ctx.body = e.toString()
  }
})

router.post('/searchEnterInto', async (ctx) => {
  // console.log('抓拍Base64', ctx.request.body)
  ctx.body = await uploadController.openRecord(ctx.request.body.base64)
  // try {
  //   ctx.body = await uploadController.baiduSearch(ctx.request.body)
  // } catch (e) {
  //   // console.log(e)
  //   ctx.status = 406
  //   ctx.body = e.toString()
  // }
})

router.post('/searchLeave', async (ctx) => {
  console.log('离开识别接口')
  // console.log('抓拍Base64', ctx.request.body)
  ctx.body = await uploadController.outRecord(ctx.request.body.base64)
})

module.exports = router
