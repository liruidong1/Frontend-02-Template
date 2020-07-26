class ChunkedBodyParser {

    length = 0;
    content = [];
    isFinished = false;
    state = this.waitingLength;

    constructor() {}

    parser(char) {
        this.state = this.state(char);
    }

    waitingLength(char){
        if(char === '\r') {
            if(this.length === 0) {
                this.isFinished = true;
                return this.end;
            }

            return this.waitingLengthEnd;
        }else {
            this.length *= 16;
            this.length += parseInt(char, 16);
            return this.waitingLength;
        }
    }

    waitingLengthEnd(char) {
        if(char === '\n') {
            return this.readingChunk;
        }else {
            return this.waitingLengthEnd;
        }
    }

    readingChunk(char) {
        this.content.push(char);
        this.length -= char.length;
        if(this.length === 0) {
            return this.waitingNewLine;
        }else {
            return this.readingChunk;
        }
    }

    waitingNewLine(char){
        if(char === '\r') {
            return this.waitingNewLineEnd;
        }else {
            return this.waitingNewLine;
        }
    }

    waitingNewLineEnd(char) {
        if(char === '\n') {
            return this.waitingLength;
        }else {
            return this.waitingNewLineEnd;
        }
    }

    end(char) {
        return this.end;
    }
}

module.exports = ChunkedBodyParser;
