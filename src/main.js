import Vue from 'vue';
import App from './App.vue'
import Field from './field/Field.vue';
import CellDefs from './field/CellDefs.vue';
import Cell from './field/Cell.vue';
import WallDefs from './field/WallDefs.vue';
import Player from './field/Player.vue';
import Key from './field/Key.vue';

Vue.component("field", Field);
Vue.component("cell-defs", CellDefs);
Vue.component("cell", Cell);
Vue.component("wall-defs", WallDefs);
Vue.component("player", Player);
Vue.component("key", Key);

new Vue({
    el: '#app',
    render: h => h(App),
})
