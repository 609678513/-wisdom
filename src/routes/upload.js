
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

router.post('/search', async (ctx) => {
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

// router.post('/upload', async (ctx) => {
//   console.log('请求来了')
//   try {
//     ctx.body = await stuController.import(ctx.request.files.file)
//   } catch (e) {
//     // console.log(e)
//     ctx.status = 406
//     ctx.body = e.toString()
//   }
//   // 创建可读流
//   // const reader = fs.createReadStream(file.path);
//   // // let filePath = path.join(__dirname, 'public/images/') + `/${file.name}`;
//   // console.log('路径测试',path.join( '..', __dirname))
//   // let filePath = 'F:/test/upload/server/public/images' + `/${file.name}`;
//   // // 创建可写流
//   // const upStream = fs.createWriteStream(filePath);
//   // // 可读流通过管道写入可写流
//   // reader.pipe(upStream);
//   // return ctx.body = "上传成功！";
// })

// router.post('/login', async (ctx) => {
//   console.log('我是请求额',ctx)
//   ctx.body = await stuController.login(ctx.request.body)
// })
//
// router.put('/', async (ctx) =>{
//   ctx.body = 'this is updata'
//   ctx.body = await stuController.updateStuOne(ctx.request.body)
// })



module.exports = router
