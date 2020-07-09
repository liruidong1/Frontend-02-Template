const damage = {
    bite: 'bite'
}

class Dog {
    constructor(type = "normal", name = "贝贝") {
        this.type = type;
        this.name = name;
    }

    bite(){
        return damage.bite;
    }
}

class Man{

    constructor(name = "Tony") {
        this.name = name;
        this.healthValue = 100;
    }

    hurt(damageType) {
        if(damageType === damage.bite){
            this.healthValue -= 10;
        }else{
            this.healthValue -= 5;
        }
    }

    toString(){
        return this.name;
    }
}

new Man().hurt(new Dog().bite());