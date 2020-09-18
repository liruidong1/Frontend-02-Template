export default class Component {
    constructor() {}

    setAttribute(name, value){
        this.root.setAttribute(name, value);
    }

    appendChild(child){
        child.mountTo(this.root);
    }

    mountTo(parent){
        parent.appendChild(this.render());
    }

    render(){}
}

class ElementWrapper extends Component{

    constructor(type) {
        super();
        this.root = document.createElement(type);
    }

}

class TextWrapper extends Component{

    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }
}

export function createElement(type, attributes = {}, ...children){
    let el;

    if(typeof type === 'string') {
        el = new ElementWrapper(type);
    }else{
        el = new type;
    }

    for(let name in attributes) {
        el.setAttribute(name, attributes[name]);
    }

    for(let child of children){
        if(typeof child === 'string') {
            child = new TextWrapper(child);
        }
        el.appendChild(child);
    }

    return el;
}