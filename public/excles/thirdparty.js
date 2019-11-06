var https = require('https');
var qs = require('querystring');

const param = qs.stringify({
  'grant_type': 'client_credentials',
  'client_id': 'wtqyGSGWPt7Mxdh67xDW1K1v', //'您的 Api Key',
  'client_secret': 'UbmTRD7RydlcOWLtBgfxvmc2RdFEcF07' //'您的 Secret Key'
});

https.get(
  {
    hostname: 'aip.baidubce.com',
    path: '/oauth/2.0/token?' + param,
    agent: false
  },
  function (res) {
    // 在标准输出中查看运行结果
    res.pipe(process.stdout);
    res.on('data',function (data) {
      //取得access_token
      console.log('res.access_token',JSON.parse(data).access_token)
      // access_token = JSON.parse(data).access_token
    })
    // console.log('res.access_token',res.data)
  }
);