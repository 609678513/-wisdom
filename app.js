const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')

// const bodyparser = require('koa-bodyparser'
const koaBody = require('koa-body')
const logger = require('koa-logger')
const cors = require('kcors')
const session = require('koa-session')
const serve = require('koa-static');
const path = require('path')

const qsJSON = require('./src/QueryStringJSON/index')
// 路由引入
// const index  = require('./src/routes/index')
// const users  = require('./src/routes/student')
const person  = require('./src/routes/person')
const department  = require('./src/routes/department')
const users = require('./src/routes/users')
const upload = require('./src/routes/upload')
const agreedRecord = require('./src/routes/agreedRecord')
const attendance = require('./src/routes/attendance')

 // 1.主页静态网页 把静态页统一放到public中管理
const home  = serve(path.join(__dirname)+'/public/');

global.serverPath= __dirname;
// console.log('app的路径', __dirname)
qsJSON(app)
// error handler
onerror(app)

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // 系统内自定义异常
    if (err.ercode) {
      ctx.response.body = err
    } else {
      ctx.response.status = 200
      ctx.response.body = {
        status: 200,
        message: err.message,
        isSuccess: false
      }
    }
  }
})
// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}))
// 注册公开文件夹
app.use(home);
app.use(json())
app.use(logger())
app.use(cors({

  // 该选项是一个函数，设置域名访问权限，函数的返回值即是允许访问的域名，对应浏览器Network响应头的Access-Control-Allow-Origin,
  // origin: function (ctx) {
  //   if (ctx.url === '/test') {
  //     return "*"; // 允许来自所有域名请求
  //   }
  //   return 'http://localhost:8080'; / /只允许 http://localhost:8080 这个域名的请求
  //     },

  // 设置所允许的HTTP请求方法
  // allowMethods: ['GET', 'POST', 'DELETE'],

  /*
   CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
       Cache-Control、
       Content-Language、
       Content-Type、
       Expires、
       Last-Modified、
       Pragma。
   */
  // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // getResponseHeader('myData')可以返回我们所需的值
  exposeHeaders: ['Token', 'daiym'],

   // // 表明服务器支持的所有头信息字段
  // allowHeaders: ['Content-Type', 'Authorization', 'Accept','Token'],

  // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
  // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
  // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
  // maxAge: 5,

  // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
  // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  credentials: true,

}))

app.keys = ['Unspeakable secrets']
const CONFIG = {
  key: 'session',
  maxAge: 60 * 1000, // cookie的过期时间 毫秒
  overwrite: true,
  httpOnly: true, // true表示只有服务器端可以修改cookie
  signed: true,
  rolling: false, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  renew: false
}
app.use(session(CONFIG, app))

app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// routes注册
// app.use(index.routes(), index.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(person.routes(), person.allowedMethods())
app.use(department.routes(), department.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(agreedRecord.routes(), agreedRecord.allowedMethods())
app.use(attendance.routes(), attendance.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  logger.error(err);
  console.error('server error', err, ctx)
});
module.exports = app
