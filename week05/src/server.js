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
        div{
            background-color: aqua;
        }
        
        body .a {
            max-width: 100px;
        }
        
        .body .a {
            max-width: 200px;
        }
        
        div.a.b {
            display: flex;
        }
        
        
        div#id.a.b{
            display: inline-block;
        }
        
        .a.b{
            display: block;
        }
        
    </style>
</head>
<body class="body">
    <div class="a b" id="id">
        ssss
        <div class="a">ddddd</div>
    </div>
</body>
</html>
`);
    });
}).listen(8088);

console.log('server started!')
