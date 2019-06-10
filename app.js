const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser'
const koaBody = require('koa-body')
const logger = require('koa-logger')
var cors = require('kcors')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

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
  // credentials: true,

}))
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
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app
