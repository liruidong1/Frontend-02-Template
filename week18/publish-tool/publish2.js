const http = require('http')
const fs = require('fs')
const archiver = require('archiver') // 压缩

const archive = archiver('zip', {
    zlib: { level: 9 }
})

// pipe到文件流
// const file = fs.createReadStream('./sample/sample.html')
//
// archive.directory('./sample', false)
// archive.finalize()
// archive.pipe(fs.createWriteStream('tmp.zip'))

// fs.stat('./sample/sample.html', ((err, stats) => {
//     const request = http.request({
//         hostname: '127.0.0.1',
//         port: 8082,
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/octet-stream",
//             "Content-Length": stats.size
//         }
//     }, response => {
//         console.log(response)
//     })
//
//     const file = fs.createReadStream('./sample/sample.html')
//
//     archive.directory('./sample', false)
//
//     file.pipe(request)
//     file.on('end', () => request.end())
// }))

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

// const file = fs.createReadStream('./sample/sample.html')

archive.directory('./sample', false)
archive.finalize()
archive.pipe(request)


