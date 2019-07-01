
const xlsx = require("node-xlsx")
const classHelper = require("../service/dbHelper/classHelper")


exports.findClass = async (ctx) => {
// console.log('这是参数哈',ctx.query.filter.$or)
  return await classHelper.find(ctx.query.filter)

}

exports.findOne = async (ctx) => {
  console.log('我是ID请求额',ctx.params.id)
  return await classsHelper.findOne({'_id': ctx.params.id})

}

exports.import = async (file) => {
  // 上传单个文件
  // const file = ctx.request.files.file; // 获取上传文件
  const xlsxData = xlsx.parse(file.path)
  const excelObj = xlsxData[0].data
  const CityArray = ['num', 'name', 'class', 'sex', 'tel']
  const insertData = [];//存放数据
  for (let i = 1; i < excelObj.length; i++) {
    const rdata = excelObj[i];
    const CityObj = {};
    for (let j = 0; j < rdata.length; j++) {
      CityObj[CityArray[j]] = rdata[j]
    }
    insertData.push(CityObj)
  }
  try {
    var imData = await classHelper.import(insertData)
  } catch (err) {
    console.log('我是控制层错误',err)
    return err;
  }
  return imData;
}
// 导入
// exports.import = async (file) => {
//     // 创建可读流
//     const reader = fs.createReadStream(file.path);
//     let filePath = path.join(__dirname, 'public/images/') + `/${file.name}`;
//     // 创建可写流
//     const upStream = fs.createWriteStream(filePath);
//     // 可读流通过管道写入可写流
//     reader.pipe(upStream);
//     return ctx.body = "上传成功！";
//   }

