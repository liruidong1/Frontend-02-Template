const http = require('http')
// const fs = require('fs')
const unzipper = require('unzipper')

http.createServer(((request, response) => {

    // let outFile = fs.createWriteStream('../server/public/index.html')
    // let outFile = fs.createWriteStream('../server/public/index.zip')
    // request.pipe(outFile)

    request.pipe(unzipper.Extract({ path: '../server/public/' }))


})).listen(8082)