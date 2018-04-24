<template>
    <svg :width="width"
         :height="height"
         :viewBox="viewBox"
         class="field"
    >
        <defs>
            <g id="cell">
                <cell-defs :size="size"/>
            </g>
            <g id="wall">
                <wall-defs :size="size"/>
            </g>
        </defs>
        <template v-for="(row, rowId) of rowsSlice(map)">
            <template v-for="(col, colId) of colsSlice(row)">
                <cell :href="idMap(col)"
                      :size="size"
                      :row="rowsOffset(rowId)"
                      :col="colsOffset(colId)"/>
            </template>
        </template>

        <template v-for="(row, rowId) of map">
            <template v-for="(col, colId) of row">
                <key v-if="col === 'k'"
                     :size="size"
                     :row="rowId"
                     :col="colId"/>
                <player v-if="col === 'p'"
                        :size="size"
                        :row="player.y"
                        :col="player.x"/>
            </template>
        </template>
    </svg>
</template>


<script>
import TWEEN from "@tweenjs/tween.js"

export default {
    name: 'field',
    props: {
        size: { type: [ Number, String ], default: 40 },
        map: { type: Array, default: () => [] },
        player: { type: Object, default: () => ({x: 0, y: 0}) },
    },
    created() {
        this.VIEW_DISTANCE = 10;
    },
    beforeMount() {
        this.resize();
        window.addEventListener('resize', this.resize);
    },
    mounted() {
        this.calcViewBox(this.player);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },
    data() {
      return {
          width: 0,
          height: 0,
          viewBox: '0 0 100 100'
      }
    },
    computed: {
    },
    methods: {
        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.calcViewBox(this.player);
        },
        calcViewBox(player) {
            let playerCoordX = 0;
            let playerCoordY = 0;
            let mapWidth = this.map[0].length * this.size;
            let mapHeight = this.map.length * this.size;

            if (mapWidth < this.width) {
                playerCoordX = (mapWidth - this.width) * 0.5;
            } else {
                playerCoordX = player.x * this.size - (this.width - this.size) * 0.5;
                playerCoordX = Math.min(
                    mapWidth - this.width,
                    Math.max(0, playerCoordX)
                );
            }

            if (mapHeight < this.height) {
                playerCoordY = (mapHeight - this.height) * 0.5;
            } else {
                playerCoordY = player.y * this.size - (this.height - this.size)* 0.5;
                playerCoordY = Math.min(
                    mapHeight - this.height,
                    Math.max(0, playerCoordY)
                );
            }

            this.viewBox = `${playerCoordX} ${playerCoordY} ${this.width} ${this.height}`;
        },
        idMap(code) {
            let id = '';
            switch (code) {
                case 'w': id = '#wall'; break;
                case ' ': id = '#cell'; break;
            }
            return id;
        },
        rowsSlice(array) {
            let startIndex = Math.max(this.player.y - this.VIEW_DISTANCE, 0);
            let endIndex = Math.min(this.player.y + this.VIEW_DISTANCE, this.map.length);
            return array.slice(startIndex, endIndex);
        },
        colsSlice(array) {
            let startIndex = Math.max(this.player.x - this.VIEW_DISTANCE, 0);
            let endIndex = Math.min(this.player.x + this.VIEW_DISTANCE, this.map[0].length);
            return array.slice(startIndex, endIndex);
        },
        rowsOffset(rowId) {
            return rowId + Math.max(this.player.y - this.VIEW_DISTANCE, 0);
        },
        colsOffset(colId) {
            return colId + Math.max(this.player.x - this.VIEW_DISTANCE, 0);
        }
    },
    watch: {
        'player.x': function(newValue, oldValue) {
            let pos = { x: oldValue, y: this.player.y };
            new TWEEN.Tween(pos)
                .to({x: newValue}, 200)
                .onUpdate((obj) => this.calcViewBox(obj))
                .start();
        },
        'player.y': function(newValue, oldValue) {
            let pos = { x: this.player.x, y: oldValue };
            new TWEEN.Tween(pos)
                .to({y: newValue}, 200)
                .onUpdate((obj) => this.calcViewBox(obj))
                .start();
        }
    }
}
</script>


<style lang="scss">
    .field {
      position: absolute;
      left: 0;
      top: 0;
    }
</style>
