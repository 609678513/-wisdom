const http = require( './service/util/axios.js')
const qs = require('querystring');
var access_token = '24.c7ef6f6ecd80ab8482c9303a1f3ac888.2592000.1577347615.282335-17306524';

var param = qs.stringify({
  'grant_type': 'client_credentials',
  'client_id': 'oYbLqVEGWXXaTnXOqmlX51t8',
  'client_secret': 'IZGwBIes4NRTzprGBARYQkdfCqYO9UFb'
});

async function getToken () {
  let res = await http.axiosGet('/oauth/2.0/token?' + param)
  access_token = res.data.access_token
  console.log('Token', access_token)
  return res.data
}
async function getToken1 () {
  let res = await http.axiosPost(`/rest/2.0/face/v3/faceset/group/add?access_token=`+ access_token,  {group_id: '1'});
  // access_token = res.data.access_token
  console.log('Token', res.data)
  return res.data
}
getToken ()
getToken1 ()
// var options = {
//   group_id: '3'
// }
// console.log('人脸搜索开始111')
// var res = http.axiosPost(`/rest/2.0/face/v3/faceset/group/delete?access_token=`+ access_token, options);
// console.log('人脸搜索开始', res.data)