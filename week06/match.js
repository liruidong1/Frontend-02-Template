function match(selector, element) {

    let selectorParts = selector.split(' ').reverse();
    let match = /(?<tagName>(\w+)?)(?<id>(#\w+)?)(?<classNames>(.[\w.]+)?)/;

    //取到第一个选择器，该选择器必须和当前节点匹配
    let part = selectorParts.shift();

    let matchResult = part.match(match);
    let {tagName, id, classNames} = matchResult.groups;

    let _tagName = element.tagName.toLowerCase();
    let _classList = element.className.split(' ');
    let _id = element.id;

    if(id && id !== ('#'+_id) || tagName && tagName !== _tagName) {
        return false;
    }

    if(classNames){
        let classList = classNames.split('\.').filter(val => !!val);
        if(_classList.length < classList.length) {
            return false;
        }else {
            for (let className of classList) {
                if (_classList.indexOf(className) === -1) {
                    return false;
                }
            }
        }
    }

    //走到此处说明已匹配目标元素
    let len = selectorParts.length, i = 0;
    element = element.parentElement;
    for(let part of selectorParts) {
        let matchResult = part.match(match);
        let {tagName, id, classNames} = matchResult.groups;

        element: while (element){
            let _tagName = element.tagName.toLowerCase();
            let _classList = element.className.split(' ');
            let _id = element.id;

            if(id && id !== ('#'+_id) || tagName && tagName !== _tagName) {
                element = element.parent;
                continue;
            }

            if(classNames){
                let classList = classNames.split('.').filter(val => !!val);
                if(_classList.length < classList.length) {
                    element = element.parent;
                }else {
                    for (let className of classList) {
                        if (_classList.indexOf(className) === -1) {
                            element = element.parent;
                            continue element;
                        }
                    }
                }
            }

            //走到此处证明匹配到了，则该跳出循环匹配下一个元素和选择器了
            element = element.parentElement;
            i++;
            break;
        }

        //判断元素是否为空，为空表示遍历到了根节点
        if(!element) {
            break;
        }

    }

    //i !== len说明选择器未遍历完，但是已经遍历到了根节点
    return i === len;
}


match("div #id.class", document.getElementById("id"));