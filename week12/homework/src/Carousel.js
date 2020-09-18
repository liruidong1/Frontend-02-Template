import Component from "./Component";

export default class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
        this.autoPlay = true;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        let index = 0;
        for (let img of this.attributes.imgList) {
            let child = document.createElement('div');
            child.className = 'carousel-item';
            child.style.backgroundImage = `url('${img}')`;
            child.innerHTML = index;
            this.root.append(child);
            index++;
        }

        this.play();
        this.drag();


        return this.root;
    }

    drag() {
        if (this.attributes.drag) {
            let width = this.attributes.width || 600;
            let position = 0;
            let down = false;

            this.root.addEventListener('mouseenter', ()=>{
                this.autoPlay = false;

                let leave = () =>{
                    if(!down) {
                        this.autoPlay = true;
                    }
                    this.root.removeEventListener('mouseleave', leave);
                }

                this.root.addEventListener('mouseleave' , leave);
            })

            this.root.addEventListener('mousedown', (event) => {
                this.autoPlay = false;
                down = true;

                let {clientX: startX} = event;

                let move = event => {

                    let {clientX: x} = event;

                    // x 为本次多动移动的距离
                    x -= startX;

                    //current 拖动后 计算界面当前显示出的元素, 拖动元素的个数是不计符号位的向下取整，比如 计算出-2.5 应该取值 -2 而不是-3，所以此处Math.floor不适用
                    let current = position - ((x - x % width) / width);

                    //next 表示拖动方向的下一个元素，正负1
                    //判断 拖动方向 x > 0, 向右拖动
                    let next = x >= 0 ? -1 : 1;

                    for (let offset of [0, next]) {
                        let pos = current + offset;
                        //计算出合理的取值，比如:当长度是4时 pos如果为4 则要转换为0
                        pos = (pos + this.root.children.length) % this.root.children.length;

                        let child = this.root.children[pos];

                        //关闭动画
                        child.style.transition = 'none';

                        // 注意translateX的值是相对于元素自身的原来的位置进行计算的
                        // 当长度位4 current为3 时 则对应的pos 为 2、3、0，
                        // -pos * width 可以刚好让该元素展示在可见区域
                        //  offset * width 的设置可以让元素定位到current的左右位置
                        // x % width 是由于前边的【-pos * width】，只要加上超出整数过移动距离的拖动距离
                        child.style.transform = `translateX(${-pos * width + offset * width + x % width}px)`;

                    }


                }

                let up = event => {
                    try {
                        down = false;
                        let {clientX: x} = event;

                        x -= startX;

                        position -= Math.round(x / width);
                        //防止position设置为了错误的值
                        position = (position + this.root.children.length) % this.root.children.length;

                        // let next = -Math.sign(Math.round(x / width) - x + Math.round(width/2) * Math.sign(x));
                        let next = Math.abs(x % width) > (width / 2) ? Math.sign(x) : -Math.sign(x);

                        for (let offset of [0, next]) {
                            let pos = position + offset;

                            pos = (pos + this.root.children.length) % this.root.children.length;

                            let child = this.root.children[pos];

                            child.style.transition = '';
                            child.style.transform = `translateX(${-pos * width + offset * width}px)`;
                        }
                    }finally {
                        this.autoPlay = true;
                        document.removeEventListener('mousemove', move);
                        document.removeEventListener('mouseup', up);
                    }
                }

                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);

            })
        }
    }

    play() {
        if (this.attributes.autoPlay) {

            this.autoPlay = this.attributes.autoPlay;

            this.currentIndex = 0;
            this.nextIndex = 0;

            this.playInterval = setInterval(() => {

                if (!this.autoPlay) return;

                let children = this.root.children;
                this.nextIndex = (this.currentIndex + 1) % children.length;

                let current = children[this.currentIndex];
                let next = children[this.nextIndex];

                next.style.transition = 'none';
                next.style.transform = `translateX(${100 - this.nextIndex * 100}%)`;

                setTimeout(() => {
                    if (!this.autoPlay) return;

                    next.style.transition = '';
                    current.style.transform = `translateX(${-100 - this.currentIndex * 100}%)`;
                    next.style.transform = `translateX(${-this.nextIndex * 100}%)`;

                    this.currentIndex = this.nextIndex;
                }, 16);


            }, 1500)
        }
    }
}