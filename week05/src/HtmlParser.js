const EOF = Symbol('EOF');
const css = require('css');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let root = {type: 'document', children: []};
let stack = [root];

let rules = [];

//css规则解析开始
function addCSSRules(text) {
    let ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

//计算元素的css规则
function computeCss(element) {
    //复制并反转了stack
    let elements = stack.slice().reverse();

    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(' ').reverse();

        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;

        let j = 1;
        for (let _element of elements) {
            if (match(_element, selectorParts[j])) {
                j++;
            }
        }

        matched = j >= selectorParts.length;

        if (matched) {
            let sp = specificity(rule.selectors[0]);
            let computedStyle = element.computedStyle;
            for(let declaration of rule.declarations) {
                let {property, value} = declaration;
                if(!computedStyle[property]) {
                    computedStyle[property] = {};
                }

                if(!computedStyle[property].specificity || specificityCompare(computedStyle[property].specificity, sp) < 0) {
                    computedStyle[property].value = value;
                    computedStyle[property].specificity = sp;
                }
            }
        }
    }
}

//匹配元素的css规则
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    let match = /(?<tagName>(\w+)?)(?<id>(#\w+)?)(?<classNames>(.[\w.]+)?)/;

    let matchResult =  selector.match(match);

    let {tagName, id, classNames} = matchResult.groups;

    let matched = true;

    if (id) {
        let attr = element.attributes.filter(attr => attr.name === 'id' );
        matched = matched && attr.length > 0 && attr[0].value === id.replace('#','');
    }

    if (tagName) {
        matched = matched && element.tagName === tagName;
    }

    if (classNames) {
        classNames = classNames.split('.').filter(val => !!val);
        let attr = element.attributes.filter(attr => attr.name === 'class' );
        let _classNames = attr.length > 0 ? attr[0].value.split(' ') : [];
        if(_classNames.length < classNames.length) {
            matched = false;
        }else {
            for(let className of classNames) {
               if(className) {
                   matched = matched && _classNames.indexOf(className) > -1;
               }
            }
        }
    }

    return matched;
}

//计算选择器优先级
function specificity(selector){
    let p = [0,0,0,0];
    let selectorParts = selector.split(' ');
    let match = /(?<tagName>(\w+)?)(?<id>(#\w+)?)(?<classNames>(.[\w.]+)?)/;

    for(let part of selectorParts) {
        let matchResult =  part.match(match);

        let {tagName, id, classNames} = matchResult.groups;

        if(tagName) {
            p[3] += 1;
        }

        if(id) {
            p[1] += 1;
        }

        if(classNames) {
            classNames = classNames.split('.').filter(val => !!val);
            p[2] += classNames.length;
        }
    }

    return p;
}

//选择器优先级比较
function specificityCompare(sp1, sp2) {
    if(sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0]
    }

    if(sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1]
    }

    if(sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2]
    }

    return sp1[3] - sp2[3]
}


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

        //TODO 计算CSS时机
        computeCss(element);

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
            if (token.tagName === 'style') {
                addCSSRules(top.children[0].content);
            }
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

module.exports.parserHTML = function (html) {
    let state = data;
    for (let char of html) {
        state = state(char);
    }
    state = state(EOF);

    return root;
}
