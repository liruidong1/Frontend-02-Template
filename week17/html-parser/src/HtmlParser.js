let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack;

const EOF = Symbol('EOF');

function emit(token) {
    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }

        element.tagName = token.tagName;

        for (let key in token) {
            if (key !== 'type' && key !== 'tagName') {
                element.attributes.push({
                    name: key,
                    value: token[key]
                })
            }
        }

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error(token.tagName + " Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (!currentTextNode) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(char) {
    if (char === '<') {
        return tagOpen;
    } else if (char === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: char
        })
        return data;
    }
}

function tagOpen(char) {
    if (char === '/') {
        return endTagOpen;
    } else if (char.match('^[a-zA-Z]$')) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(char);
    }
}

function endTagOpen(char) {
    if (char.match('^[a-zA-Z]$')) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(char);
    } else if (char === '>') {

    } else if (char === EOF) {

    } else {
    }
}

function tagName(char) {
    if (char.match(/^[\r\t\f ]$/)) {
        return beforeAttributeName;
    } else if (char === '/') {
        return selfClosingStartTag;
    } else if (char.match('^[a-zA-Z]$')) {
        currentToken.tagName += char.toLowerCase();
        return tagName;
    } else if (char === '>') {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

//解析标签属性
function beforeAttributeName(char) {
    if (char.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (char === '/' || char === '>' || char === EOF) {
        return afterAttributeName(char);
    } else if (char === '=') {

    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(char);
    }
}

function attributeName(char) {
    if (char === "=") {
        return beforeAttributeValue;
    } else if (char.match(/^[\r\t\f ]$/) || char === '/' || char === '>' || char === EOF) {
        return afterAttributeName(c);
    } else if (char === '\u0000') {

    } else if (char === '"' || char === "'" || char === '<') {

    } else {
        currentAttribute.name += char;
        return attributeName;
    }
}

function afterAttributeName(char) {

}

function beforeAttributeValue(char) {
    if (char.match(/^[\r\t\f ]$/) || char === '/' || char === '>' || char === EOF) {
        return beforeAttributeValue;
    } else if (char === '"') {
        return doubleQuotedAttributeValue;
    } else if (char === "'") {
        return singleQuotedAttributeValue;
    } else {
        return unquotedAttributeValue(char);
    }
}

function afterQuotedAttributeValue(char) {
    if (char.match(/^[\r\t\f ]$/)) {
        return beforeAttributeName;
    } else if (char === '/') {
        return selfClosingStartTag;
    } else if (char === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (char === EOF) {

    } else {
        currentAttribute.value += char;
        return doubleQuotedAttributeValue;
    }
}

function doubleQuotedAttributeValue(char) {
    if (char === '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (char === '\u0000') {

    } else if (char === EOF) {

    } else {
        currentAttribute.value += char;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(char) {
    if (char === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (char === '\u0000') {

    } else if (char === EOF) {

    } else {
        currentAttribute.value += char;
        return doubleQuotedAttributeValue;
    }
}

function unquotedAttributeValue(char) {
    if (char.match(/^[\r\t\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (char === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (char === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (char === '\u0000') {

    } else if (char === '"' || char === "'" || char === '<' || char === '=' || char === '`') {

    } else if (char === EOF) {

    } else {
        currentAttribute.value += char;
        return unquotedAttributeValue;
    }
}

//属性处理结束

function selfClosingStartTag(char) {
    if (char === '>') {
        currentToken.isSelfClosing = true;
        return data;
    } else if (char === EOF) {

    } else {

    }
}

export function parserHTML(html) {
    let state = data;
    for (let char of html) {
        state = state(char);
    }
    state(EOF);
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;
    let root = {type: 'document', children: []};
    stack = [root];
    return root
}
