const TICK = Symbol('tick');
const TICK_HANDLER  = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');
const ANIMATION_STATUS = Symbol('animation-status');

const ANIMATION_STATUS_DIC = {
   INITED: Symbol('inited'),
   STARTED: Symbol('started'),
   PAUSED: Symbol('paused'),
}

export class Timeline {

   constructor() {
      this[ANIMATIONS] = new Set();
      this[START_TIME] = new Map();

      this[ANIMATION_STATUS] = ANIMATION_STATUS_DIC.INITED;
   }

   start(){
      if(this[ANIMATION_STATUS] !== ANIMATION_STATUS_DIC.INITED) return;
      this[ANIMATION_STATUS] = ANIMATION_STATUS_DIC.STARTED;
      let startTime = Date.now();
      this[PAUSE_TIME] = 0;
      this[TICK] = () => {
         let now = Date.now();
         for(let animation of this[ANIMATIONS]) {
            let t;
            if(this[START_TIME].get(animation) < startTime ){
               t = now - startTime;
            }else {
               t = now - this[START_TIME].get(animation);
            }

            t -= this[PAUSE_TIME] + animation.delay;

            if(animation.duration < t ) {
               this[ANIMATIONS].delete(animation);
               t = animation.duration;
            }

            if(t > 0){
               animation.receive(t);
            }
         }
         this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
      }

      this[TICK]();
   }

   pause(){
      if(this[ANIMATION_STATUS] !== ANIMATION_STATUS_DIC.STARTED) return;
      this[ANIMATION_STATUS] = ANIMATION_STATUS_DIC.PAUSED;
      this[PAUSE_START] = Date.now();
      cancelAnimationFrame(this[TICK_HANDLER]);
   }

   resume(){
      if(this[ANIMATION_STATUS] !== ANIMATION_STATUS_DIC.PAUSED) return;
      this[ANIMATION_STATUS] = ANIMATION_STATUS_DIC.STARTED;
      this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
      this[TICK]();
   }

   reset(){
      this.pause();
      this[PAUSE_TIME] = 0;
      this[ANIMATIONS] = new Set();
      this[START_TIME] = new Map();
      this[PAUSE_START] = 0;
      this[TICK_HANDLER] = null;
      this[ANIMATION_STATUS] = ANIMATION_STATUS_DIC.INITED
   }

   add(animation, startTime = Date.now()){
      this[ANIMATIONS].add(animation);
      this[START_TIME].set(animation, startTime);
   }
}

export class Animation{

   constructor(object, property, startVal, endVal, duration, delay, timingFunction, template) {
      this.object = object;
      this.property = property;
      this.startVal = startVal;
      this.endVal = endVal;
      this.duration = duration;
      this.delay = delay;
      this.timingFunction = timingFunction || (val => val);
      this.template = template || (val => val);
   }

   receive(time){
      let range = this.endVal - this.startVal;
      let progress = this.timingFunction(time / this.duration);
      this.object[this.property] = this.template(this.startVal + range * progress);
   }
}
