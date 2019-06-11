const path = require('path')
const fs = require('fs')
const router = require('koa-router')()
const ufc = require('../controller/uploadFileController')
const xlsx = require("node-xlsx")

router.prefix('/upload')

router.post('/', async (ctx, next) => {

  try {
    ctx.body = await ufc.import(ctx.request.files.file)
    // logger.debug('[人员] [查询] [结果]', ctx.body)
  } catch (e) {
    // console.log(e)
    ctx.status = 406
    ctx.body = e.toString()
  }

  // 创建可读流
  // const reader = fs.createReadStream(file.path);
  // // let filePath = path.join(__dirname, 'public/images/') + `/${file.name}`;
  // console.log('路径测试',path.join( '..', __dirname))
  // let filePath = 'F:/test/upload/server/public/images' + `/${file.name}`;
  // // 创建可写流
  // const upStream = fs.createWriteStream(filePath);
  // // 可读流通过管道写入可写流
  // reader.pipe(upStream);
  // return ctx.body = "上传成功！";
})

// router.post('/', function (ctx, next) {
//   try {
//     ctx.body = await.ufc.import(ctx.request.files.file)
//   } catch (e) {
//     // console.log(e)
//     ctx.status = 406
//     ctx.body = e.toString()
//   }
//   // console.log('我是请求哦',ctx.request.files)
//   // ctx.body = 'this is a 文件上传!'
// })

router.get('/', function (ctx, next) {
    console.log('我是请求额',ctx.request.body.files)
    ctx.body = 'this is a users haha!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
