const http = require('http')
const https = require('https')
const unzipper = require('unzipper')
const querystring = require('querystring')

const clientId = 'Iv1.d6a0beeced783b01'
const clientSecrets = '892bc60e13ef5a43866dd25b774cdeb0e71a2fec'

// 2.auth 路由：接受code，用code + client_id + client_secret 换 token
function auth(request, response) {
  const query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, (info) => {
    response.write(`<a href="http://localhost:8082/publish?token=${info.access_token}">publish</a>`)
    response.end();
  });
}

function getToken(code, callback) {
  const request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=${clientId}&client_secret=${clientSecrets}`,
    port: 443,
    method: "POST",
  }, function(response) {
    let body = "";
    response.on('data', chunk => {
      console.log(chunk.toString());
      body += (chunk.toString());
    })
    response.on('end', () => {
      callback(querystring.parse(body));
    })
  })

  request.end()
}

// 4. publish路由：用token获取用户信息，检查权限，接受发布
function publish(request, response) {

  const query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);

  getUser(query.token, info => {
    if (info.login === 'liruidong1') {
      request.pipe(unzipper.Extract({
        path: '../server/public'
      }));
      request.on('end', () => {
        response.end("Success!")
      })
    }
  })


}

function getUser(token, callback) {
  const request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": 'kevin-publish'
    }
  }, function(response) {
    let body = "";
    response.on('data', chunk => {
      body += (chunk.toString());
    })
    response.on('end', () => {
      callback(JSON.parse(body));
    })
  });

  request.end();
}

http.createServer(function(request, response) {
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response);
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response);
  }

}).listen(8082);