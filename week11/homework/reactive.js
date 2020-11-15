
let callbacks = new Map();
let reactivities = new Map();

let usedReactivities = [];

function effect(cb){
    usedReactivities = [];
    cb();

    for(let reactivity of usedReactivities) {
        let [obj, prop] = reactivity;

        if(!callbacks.has(obj)) {
            callbacks.set(obj, new Map());
        }

        if(!callbacks.get(obj).has(prop)) {
            callbacks.get(obj).set(prop, []);
        }

        callbacks.get(obj).get(prop).push(cb);
    }
}

function reactive(object){
    if(reactivities.has(object)) {
        return reactivities.get(object);
    }

    let po = new Proxy(object, {
        set(obj, prop, val){
            obj[prop] = val;

            if(callbacks.has(obj) && callbacks.get(obj).has(prop)) {
                for (let cb of callbacks.get(obj).get(prop)) {
                    cb();
                }
            }
        },

        get(obj, prop) {
            usedReactivities.push([obj, prop]);
            if(typeof obj[prop] === 'object') {
                return reactive(obj[prop]);
            }
            return obj[prop];
        }
    })

    reactivities.set(object, po);
    return po;
}
