const path = require('path')
const fs = require('fs')
const router = require('koa-router')()
const classController = require('../controller/classController')
const xlsx = require("node-xlsx")

router.prefix('/index')

router.get('/', async (ctx) =>{
  ctx.body = 'this is a users haha!'
  ctx.body = await classController.findClass(ctx)
})

router.get('/:id', async (ctx) => {
  ctx.body = await classController.findOne(ctx)
})

router.post('/upload', async (ctx) => {
  try {
    ctx.body = await classController.import(ctx.request.files.file)
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






module.exports = router
