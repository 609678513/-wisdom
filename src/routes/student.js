const path = require('path')
const fs = require('fs')
const router = require('koa-router')()
const stuController = require('../controller/stuController')
const xlsx = require("node-xlsx")

router.prefix('/student')

router.get('/', async (ctx) =>{
  ctx.body = 'this is a users haha!'
  ctx.body = await stuController.findPageQuery(ctx)
})


// router.get('/', async (ctx) =>{
//   ctx.body = 'this is a users haha!'
//   ctx.body = await stuController.findPage(ctx)
// })

router.get('/:id', async (ctx) => {
  ctx.body = await stuController.findOne(ctx)
})

router.post('/upload', async (ctx) => {
  console.log('请求来了')
  try {
    ctx.body = await stuController.import(ctx.request.files.file)
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

router.post('/login', async (ctx) => {
  console.log('我是请求额',ctx)
  ctx.body = await stuController.login(ctx.request.body)
})

router.put('/', async (ctx) =>{
  ctx.body = 'this is updata'
  ctx.body = await stuController.updateStuOne(ctx.request.body)
})



module.exports = router
