const baidu = require( './controller/BaiDuFaceRecognition')

baidu.detect().then((res) =>{
  console.log('res1', res.data)
})
