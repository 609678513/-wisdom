const path = require('path')
const fs = require('fs')
const personHelper = require("../service/dbHelper/personHelper")
const baidu  = require('../thirdparty/controller/BaiDuFaceRecognition')

// 照片上传
exports.uploadPhoto = async (file) => {
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let nowFileName = Date.now() + '.' +  file.name.split('.').pop();
  let filePath = path.join(__dirname.substring(0,22), 'public/images/') + nowFileName
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  let res = await baidu.detect(filePath)
  if(res.error_code !== 0){
    fs.unlinkSync(filePath)
  }
  return { baidu: res, fileName: nowFileName}
}

// 开门记录
exports.openRecord = async (base64) => {
  let result = await baidu.search(base64)
  let res = result.data
  console.log('人脸搜索结果', res)
  let person = {}
  if(res.error_code === 0){
    let user
    if(res.result.user_list.length > 1){
        user = await res.result.user_list.reduce((a, b) => {
        if (a.score >= b.score) return a
        if (a.score < b.score) return b
      })
    }else {
      user = res.result.user_list[0]
    }
    let filter ={
      type: user.group_id,
      _id: user.user_id
    }
    person = await personHelper.findOne(filter, 'department')
    console.log('查找到的用户', person)
    //---------------- 在此处写上开门记录 ------------------------------
  }
  return { person: person, baidu: res}
}
