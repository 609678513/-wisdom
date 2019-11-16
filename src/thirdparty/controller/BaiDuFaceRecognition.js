const http = require( '../service/util/axios.js')
const path = require('path')
const qs = require('querystring');
const fs = require('fs');
//读取待识别图像并base64编码

var access_token = '';

const param = qs.stringify({
  'grant_type': 'client_credentials',
  'client_id': 'wtqyGSGWPt7Mxdh67xDW1K1v',
  'client_secret': 'UbmTRD7RydlcOWLtBgfxvmc2RdFEcF07'
});

async function getToken () {
  let res = await http.axiosGet('/oauth/2.0/token?' + param)
  access_token = res.data.access_token
  console.log('Token', access_token)
  return res.data
}

// 人脸检测 1
exports.detect =  async  (Path)  => {
  await getToken ()
  let bitmap = fs.readFileSync(Path);
  let base64str1 = new Buffer(bitmap).toString('base64');
  let options = {
    image: base64str1,
    liveness_control: 'NORMAL',
    image_type: 'BASE64',
  }
  let res = await http.axiosPost(`/rest/2.0/face/v3/detect?access_token=`+ access_token, options);
  // console.log('Token人脸检测', access_token)
  return  res.data
}

// 人脸对比 0
exports.match = async  (person)  => {
  let options = [
    {
      "image": "sfasq35sadvsvqwr5q...",
      "image_type": "BASE64",
      "face_type": "LIVE",
      "quality_control": "LOW",
      "liveness_control": "HIGH"
    },
    {
      "image": "sfasq35sadvsvqwr5q...",
      "image_type": "BASE64",
      "face_type": "IDCARD",
      "quality_control": "LOW",
      "liveness_control": "HIGH"
    }
  ]
  return await http.axiosPost(`/rest/2.0/face/v3/match/access_token?`+ access_token, options);

}

// 人脸搜索 0
exports.search = async  (base64)  => {
  await getToken ()
  let options = {
    image: base64, // 必选
    image_type: 'BASE64',// 必选
    group_id_list: '0', // 指定用户组查找，必选
    // user_id: 'user2', // 指定用户id 查找 非必选
    // user_info: 'daiym3',// 用户描述 非必选
    liveness_control: 'NORMAL',// 活体检测控制级别
    quality_control: 'LOW' // 图片质量检测级别
  }
  return await http.axiosPost(`/rest/2.0/face/v3/search?access_token=`+ access_token, options);

}

// 人脸更新 1
exports.update =  async  (person)  => {
  await getToken ()
  let photoPath = path.join(global.serverPath, '/public/images/') + person.photo
  let bitmap = fs.readFileSync(photoPath);
  let base64str1 = new Buffer(bitmap).toString('base64');
  let options = {
    image: base64str1, // 必选
    image_type: 'BASE64',// 必选
    group_id: person.type, // 指定用户组查找，必选
    user_id: person._id, // 指定用户id 查找 必选
    action_type: 'REPLACE',// 更新方式
    // user_info: 'daiym3',// 用户描述 非必选
    liveness_control: 'NORMAL',// 活体检测控制级别
    quality_control: 'LOW' // 图片质量检测级别
  }
  return await http.axiosPost(`/rest/2.0/face/v3/faceset/user/update?access_token=`+ access_token, options);
}
// 人脸删除,暂时不做
exports.delete =  async  (person)  => {
  let options = {
    group_id: '2627', // 指定用户组查找，必选
    user_id: 'user2', // 指定用户id 查找 必选
    face_token: ''  //需要删除的人脸图片token
  }
  return await http.axiosPost(`rest/2.0/face/v3/faceset/face/delete?access_token=`+ access_token, options);

}
// 人脸注册 1
exports.add =  async  (person)  => {
  // console.log('到人脸注册了')
  await getToken ()
  let photoPath = path.join(global.serverPath, '/public/images/') + person.photo
  let bitmap = fs.readFileSync(photoPath);
  let base64str1 = new Buffer(bitmap).toString('base64');
  let options = {
    image: base64str1, // 必选
    image_type: 'BASE64',// 必选
    group_id: person.type, //用户组ID，可以分人员类型 员工和访客来存储 必选
    user_id: person._id, //用户id 对应人员表的 _id  必选
    user_info: person.name,// 用户描述 非必选
    liveness_control: 'NORMAL',// 活体检测控制级别
    quality_control: 'LOW' // 图片质量检测级别
  }
  // console.log('options：'+ options)
  return await http.axiosPost(`/rest/2.0/face/v3/faceset/user/add?access_token=`+ access_token, options);
}
