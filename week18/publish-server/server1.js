const http = require('http')
const fs = require('fs')

http.createServer(((request, response) => {

    let outFile = fs.createWriteStream('../server/public/index.html')

    request.on('data', chunk => {
        outFile.write(chunk)
    })

    request.on('end', () => {
        outFile.end()
        response.end('success!')
    })
})).listen(8082)