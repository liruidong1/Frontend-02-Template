
const tokenReg = /([0-9.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(-)/g;
const dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function tokenize(src) {
    let result = null;

    while (true) {
        result = tokenReg.exec(src);

        if(!result) break;

        for(let i = 1; i <= dictionary.length; i++) {

            if(result[i]) {
                console.log(dictionary[i-1]);
            }

            console.log(result);
        }
    }

}

tokenize('1024 + 10 * 25');