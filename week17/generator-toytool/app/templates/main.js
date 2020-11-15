import Vue from "vue";
import HelloWorld from "./src/HelloWorld.vue";

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    render: h => h(HelloWorld)
});