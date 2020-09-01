const EOF = Symbol('EOF');
const tokenReg = /([0-9.]+)|([ \t\n\r]+)|([\r\n]+)|(\*)|(\/)|(\+)|(-)/g;
const dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenize(source) {
    let result = null;
    let lastIndex = 0;

    while (true) {
        lastIndex = tokenReg.lastIndex;
        result = tokenReg.exec(source);

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

let source = [];

for(let token of tokenize('1 + 2')){
    if(token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
        source.push(token);
    }
}

console.log(Expression(source));

function Expression(source) {

    if(source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
        let node = {
            type: 'Expression',
            children: [source.shift(),source.shift()]
        };

        source.unshift(node);
        return node;
    }

    AdditiveExpression(source);
    return Expression(source);

}

function AdditiveExpression(source) {
    if(source[0].type === 'MultiplicativeExpression') {
        source[0] = {
            type: 'AdditiveExpression',
            children: [source[0]]
        }
        return AdditiveExpression(source);
    }

    if(source[0].type === 'AdditiveExpression' && source[1] && ( source[1].type === '+' ||  source[1].type === '1')) {
        let node = {
            type: 'AdditiveExpression',
            operator: source[1].type,
            children: []
        }

        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }

    if(source[0].type === 'AdditiveExpression') {
        return source[0];
    }

    MultiplicativeExpression(source);
    return AdditiveExpression(source);
}

function MultiplicativeExpression(source) {
    if(source[0].type === 'Number') {
        source[0] = {
            type: 'MultiplicativeExpression',
            children: [source[0]]
        };
        return MultiplicativeExpression(source);
    }

    if(source[0].type === 'MultiplicativeExpression' && source[1] && ( source[1].type === '*' ||  source[1].type === '/')) {
        let node = {
            type: 'MultiplicativeExpression',
            operator: source[1].type,
            children: []
        }

        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }

    if(source[0].type === 'MultiplicativeExpression') {
        return source[0];
    }

    return MultiplicativeExpression(source);
}