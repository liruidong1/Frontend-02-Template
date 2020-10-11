import Component,{STATE, ATTRIBUTE, createElement} from "../lib/Component";

export default class List extends Component {

    constructor() {
        super();
    }

    render() {
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{this.children}</div>).render();
        return this.root
    }

    appendChild(template) {
        this.template = template
        this.render()
    }

}