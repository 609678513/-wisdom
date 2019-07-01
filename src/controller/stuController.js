
const xlsx = require("node-xlsx")
const studentsHelper = require("../service/dbHelper/studentsHelper")
const classHelper = require("../service/dbHelper/classHelper")

exports.findPageQuery = async (ctx) => {
  console.log( 'agagag',ctx.query.params)
  console.log( 'agagag',ctx.query.page)
  return await studentsHelper.findPopulate(ctx.query.params,ctx.query.page)
}

exports.findPage = async (ctx) => {

  return await studentsHelper.findPage()

}

exports.findOne = async (ctx) => {
  console.log('我是ID请求额',ctx.params.id)
  return await studentsHelper.findOne(ctx.params.id)

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

  let winStudent= []
  let loserStudent= []

  try {
    for (let arr of insertData) {
      // console.log('xuehao传入类型',typeof arr.num)
      let tag = await studentsHelper.find({num:arr.num})
      if(tag&& tag.length===0){
        let tag2 = await classHelper.findOne({classNum:arr.class})
        arr.class = tag2._id
        await studentsHelper.import(arr)
        winStudent.push(arr)
      }else {
        arr.message = '学号已存在'
        loserStudent.push(arr)
      }
    }
    console.log('winStudent',winStudent)
    console.log('loserStudent',loserStudent)
    return loserStudent
  } catch (err) {
    console.log('我是控制层错误', err)
    return err;
  }
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

exports.login = async (body) => {
  let filter ={
    num: body.num
  }
  // let filter ={
  //   num: Number(body.num)
  // }
  // let tel = Number(body.tel)
  let tel = body.tel
  console.log('我是请求额2',typeof body.num)
  return await studentsHelper.login(filter,tel)

}

exports.updateStuOne = async (body) => {
  console.log('控制层',body)
  body.class = body.class._id
  let filter ={
    _id : body._id
  }
  return await studentsHelper.updateStuOne(filter,body)

}