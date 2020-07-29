const ChunkedBodyParser = require('./ChunkedBodyParser');

class ResponseParser {
    statusLine = '';
    headers = {};
    headerName = '';
    headerValue = '';
    bodyParser = null;

    constructor() {}

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive(str) {
        this.state = this.buildStatusLine;
        for(let position = 0; position < str.length; position++) {
            let char = str.charAt(position);
            this.state = this.state(str.charAt(position));
        }
    }

    buildStatusLine(char){
        if(char === '\r') {
            return this.waitStatusLineEnd;
        }else {
            this.statusLine += char;
            return this.buildStatusLine;
        }
    }

    waitStatusLineEnd(char) {
        if (char === '\n') {
            return this.buildHeaderName;
        } else {
            return this.waitStatusLineEnd;
        }
    }

    buildHeaderName(char) {
        if(char === ':') {
            return this.waitHeaderSpace;
        }else if(char === '\r') {
            return this.headerBuildEnd;
        }else {
            this.headerName += char;
            return this.buildHeaderName;
        }
    }

    waitHeaderSpace(char){
        if(char === ' ') {
            return this.buildHeaderValue;
        }else {
            return this.buildHeaderValue;
        }
    }

    buildHeaderValue(char){
        if(char === '\r') {
            this.headers[this.headerName] = this.headerValue;
            this.headerName = '';
            this.headerValue = '';
            return this.waitStatusLineEnd;
        }else {
            this.headerValue += char;
            return this.buildHeaderValue;
        }
    }

    waitHeaderLineEnd(char){
        if(char === '\n') {
            return this.buildHeaderName;
        }else {
            return this.waitHeaderLineEnd;
        }
    }


    headerBuildEnd(char){
        if(char === '\n') {
            if(this.headers['Transfer-Encoding'] === 'chunked') {
                this.bodyParser = new ChunkedBodyParser();
            }
            return this.buildBody;
        }else {
            return this.headerBuildEnd;
        }
    }

    buildBody(char){
        if(this.bodyParser) {
            this.bodyParser.parser(char);
        }
        return this.buildBody;
    }

}

module.exports = ResponseParser;
