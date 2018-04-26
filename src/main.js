import Vue from 'vue';

import App from './App.vue';
import CellDefs from './field/CellDefs.vue';
import WallDefs from './field/WallDefs.vue';
import FinishDefs from './field/FinishDefs.vue';
import Guide from './Guide.vue';
import Field from './field/Field.vue';
import Cell from './field/Cell.vue';
import Player from './field/Player.vue';
import Key from './field/Key.vue';

Vue.component("cell-defs", CellDefs);
Vue.component("wall-defs", WallDefs);
Vue.component("finish-defs", FinishDefs);
Vue.component("guide", Guide);
Vue.component("field", Field);
Vue.component("cell", Cell);
Vue.component("player", Player);
Vue.component("key", Key);

new Vue({
    el: '#app',
    render: h => h(App),
})
