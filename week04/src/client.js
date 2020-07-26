const net = require('net');

const ResponseParser = require('./ResponseParser')
const HtmlParser = require('./HtmlParser');

class Request {

    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};

        if(!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        if(this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        }else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key=>{
                return `${key}=${encodeURIComponent(this.body[key])}`;
            }).join('&');
        }

        this.headers['Content-length'] = this.bodyText.length;
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            let parser = new ResponseParser();
            if(connection) {
                connection.write(this.toString());
            }else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                });
            }

            connection.on('data', data =>{
                console.log(data.toString());
                parser.receive(data.toString());

                if(parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });

            connection.on('error', err => {
                reject(err);
                connection.end();
            })
        })
    }
}

void async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8088',
        path: '/',
        headers: {
            ['X-Foo2']: 'custom',
        },
        body: {
            name: 'world'
        }
    });

    let response = await request.send();
    let dom = HtmlParser.parserHTML(response.body);

}();
