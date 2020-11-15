import {Animation, Timeline} from "./src/animation";
import {TimingFunction} from "./src/cubicBezier";

let tl = new Timeline();
tl.start();
tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 1000, 0, TimingFunction.linear,v => `translateX(${v}px)`));
tl.add(new Animation(document.querySelector('#el3').style, 'transform', 0, 500, 1000, 0, TimingFunction.ease,v => `translateX(${v}px)`));
tl.add(new Animation(document.querySelector('#el2').style, 'transform', 0, 500, 1000, 0, TimingFunction.easeIn,v => `translateX(${v}px)`));

document.querySelector('#pause').addEventListener('click', ()=>{
    tl.pause();
})

document.querySelector('#resume').addEventListener('click', ()=>{
    tl.resume();
})

let el4 = document.querySelector('#el4');
el4.style.transition = 'transform ease 1s';
el4.style.transform = 'translateX(500px)';