const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        response.end(`<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Title</title>
    <style>
        #container{
            width: 500px;
            height: 300px;
            display: flex;
            flex-wrap: wrap;
        }
        
        #myid {
            width: 200px;
        }
        
        .c1 {
            width: 200px;
        }
        
        
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
        <div class="c1"></div>
    </div>
</body>
</html>
`);
    });
}).listen(8088);

console.log('server started!')
