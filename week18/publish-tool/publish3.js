const http = require('http');
const archiver = require('archiver');
const child_process = require('child_process');
const querystring = require('querystring');

// 1. 打开 https://github.com/login/oauth/authorize
const clientId = 'Iv1.d6a0beeced783b01'
child_process.exec(`https://github.com/login/oauth/authorize?client_id=${clientId}`)

// 3.创建一个 server，接受token 后点击发布
http.createServer(function(request, response) {
  const query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
  publish(query.token);
}).listen(8083);

function publish(token) {
  const request = http.request({
    hostname: 'localhost',
    port: 8082,
    method: 'POST',
    path: '/publish?token=' + token,
    headers: {
      "Content-Type": "application/octet-stream"
    }
  }, response => {
    console.log(response)
  });

  const archive = archiver('zip', {
    zlib: {
      level: 9
    },
  })
  archive.directory('./sample', false)
  archive.finalize()
  archive.pipe(request)

  // request.on('end', () => {
  //   console.log('Success End!')
  // })

}