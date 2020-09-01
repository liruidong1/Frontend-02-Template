const EOF = Symbol('EOF');
const tokenReg = /([0-9.]+)|([ \t\n\r]+)|([\r\n]+)|(\*)|(\/)|(\+)|(-)/g;
const dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(src) {
    let result = null;
    let lastIndex = 0;

    while (true) {
        lastIndex = tokenReg.lastIndex;
        result = tokenReg.exec(src);

        if(result === undefined || result === null) break;

        if(tokenReg.lastIndex - lastIndex > result[0].length) break;


        let token = {
            type: null,
            value: null
        }

        for(let i = 1; i <= dictionary.length; i++) {

            if(result[i] !== undefined && result[i] !== null) {
                token.type = dictionary[i-1];
            }
        }

        token.value = result[0];

        yield token;
    }

    yield {
        type: 'EOF',
        value: EOF
    }

}

for(let token of tokenize('1024 + 10 * 25')){
    console.log(token);
}