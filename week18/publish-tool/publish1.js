const http = require('http')
const fs = require('fs')

const request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
        "Content-Type": "application/octet-stream"
    }
}, response => {
    console.log(response)
})

const file = fs.createReadStream('./src/sample.html')

file.on('data', chunk => {
    request.write(chunk)
})

file.on('end', chunk => {
    request.end(chunk)
})