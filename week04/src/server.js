const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        response.end(`<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Title</title>
</head>
<body>
    <div>
        ssss
        <div>ddddd</div>
    </div>
</body>
</html>
`);
    });
}).listen(8088);

console.log('server started!')
