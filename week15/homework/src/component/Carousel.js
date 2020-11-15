import Component, {ATTRIBUTE, STATE} from "../lib/Component";
import {enableGesture} from "../lib/gesture";
import {Timeline, Animation} from "../lib/animation";
import {TimingFunction} from "../lib/cubicBezier";

export  { STATE,ATTRIBUTE } from "../lib/Component"

export default class Carousel extends Component {
    constructor() {
        super();
    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        let index = 0;
        for (let img of this[ATTRIBUTE].imgList) {
            let child = document.createElement('div');
            child.className = 'carousel-item';
            child.style.backgroundImage = `url('${img}')`;
            child.innerHTML = index;
            this.root.append(child);
            index++;
        }

        let children = this.root.children;
        let nextPicture = ()=> {
            let nextIndex = (this[STATE].position + 1) % children.length

            let current = children[this[STATE].position];
            let next = children[nextIndex];

            t = Date.now();

            timeline.add(new Animation(current.style, 'transform',
                -this[STATE].position * width, -width - this[STATE].position * width,
                500, 0, TimingFunction.ease, val => `translateX(${val}px)` ))
            timeline.add(new Animation(next.style, 'transform',
                width - nextIndex * width, - nextIndex * width,
                500, 0, TimingFunction.ease, val => `translateX(${val}px)`  ))

            this[STATE].position = nextIndex;
            this.triggerEvent('Change', {position: this[STATE].position})

        }

        enableGesture(this.root);
        let timeline = new Timeline();
        timeline.start();

        let handler = null;

        this[STATE].position = 0;

        let t = 0;
        let ax = 0;

        let width = this[ATTRIBUTE].width || 600;

        this.root.addEventListener('start', (event) => {
            timeline.pause()
            clearInterval(handler)
            let progress = (Date.now() - t) / 500;
            ax = TimingFunction.ease(progress) * width - width
        })

        this.root.addEventListener('tap', (event) => {
            this.triggerEvent('click', {
                position: this[STATE].position,
                data: this[ATTRIBUTE].imgList[this[STATE].position]
            })
        })

        this.root.addEventListener('pan', (event) => {
            let x = event.clientX - event.startX - ax;

            let current = this[STATE].position - ((x - x % width) / width);

            let next = x >= 0 ? -1 : 1;

            for (let offset of [0, next]) {
                let pos = current + offset;
                //计算出合理的取值，比如:当长度是4时 pos如果为4 则要转换为0
                pos = (pos + children.length) % children.length;

                let child = children[pos];

                //关闭动画
                child.style.transition = 'none';
                child.style.transform = `translateX(${-pos * width + offset * width + x % width}px)`;
            }
        })

        this.root.addEventListener('end', (event) => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000)

            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % width) / width);

            let direction = Math.round((x % width) / width);

            //TODO
            if(event.isFlick) {
                if(event.velocity > 0) {
                    direction = Math.ceil((x % width) / width);
                } else {
                    direction = Math.floor((x % width) / width);
                }
            }


            let next = x >= 0 ? -1 : 1;

            for (let offset of [0, next]) {
                let pos = current + offset;
                //计算出合理的取值，比如:当长度是4时 pos如果为4 则要转换为0
                pos = (pos + children.length) % children.length;

                let child = children[pos];
                timeline.add(new Animation(child.style, 'transform',
                    -pos * width + offset * width + x % width,
                    -pos * width + offset * width + direction * width,
                    500, 0, TimingFunction.ease, val => {
                        return `translateX(${val}px)`
                    } ))

            }

            this[STATE].position = current - direction;
            this[STATE].position = (this[STATE].position + children.length) % children.length;
        })

        handler = setInterval(nextPicture, 3000)

        return this.root;
    }
}