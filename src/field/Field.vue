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
            <g id="finish">
                <finish-defs :size="size" color="#6C2DC7"/>
            </g>
        </defs>
        <g :transform="fieldOffset">
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
                    <player v-if="col === 'p'"
                            :size="size"
                            :player="player"/>
                </template>
            </template>
        </g>
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
    beforeMount() {
        this.resize();
        window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },
    data() {
      return {
          width: 0,
          height: 0,
          viewBox: '0 0 100 100',
          fieldOffset: 'translate(0,0)'
      }
    },
    methods: {
        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.viewBox = `0 0 ${this.width} ${this.height}`;
            this.calcFieldOffset(this.player);
            this.calcViewDistance();
        },
        calcFieldOffset(player) {
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

            playerCoordX = Math.round(playerCoordX);
            playerCoordY = Math.round(playerCoordY);

            this.fieldOffset = `translate(${-playerCoordX},${-playerCoordY})`;
        },
        idMap(code) {
            let id = '';
            switch (code) {
                case 'w': id = '#wall'; break;
                case 'f': id = '#finish'; break;
                case ' ': id = '#cell'; break;
            }
            return id;
        },
        colsSlice(array) {
            let startIndex = 0;
            let endIndex = this.map[0].length;
            let halfDistance = this.maxViewDistance.x * 0.5;
            let x = this.player.x;
            if (x < halfDistance) {
                endIndex = this.maxViewDistance.x;
            } else if (x > endIndex - halfDistance) {
                startIndex = endIndex - this.maxViewDistance.x;
            } else {
                startIndex = Math.ceil(x - halfDistance);
                endIndex = Math.ceil(x + halfDistance);
            }
            return array.slice(startIndex, endIndex);
        },
        rowsSlice(array) {
            let startIndex = 0;
            let endIndex = this.map.length;
            let halfDistance = this.maxViewDistance.y * 0.5;
            let y = this.player.y;
            if (y < halfDistance) {
                endIndex = this.maxViewDistance.y;
            } else if (y > endIndex - halfDistance) {
                startIndex = endIndex - this.maxViewDistance.y;
            } else {
                startIndex = Math.ceil(y - halfDistance);
                endIndex = Math.ceil(y + halfDistance);
            }
            return array.slice(startIndex, endIndex);
        },
        colsOffset(colId) {
            let endIndex = this.map[0].length;
            let halfDistance = this.maxViewDistance.x * 0.5;
            let x = this.player.x;
            let colIdWithOffset = 0;
            if (x < halfDistance) {
                colIdWithOffset = colId;
            } else if (x > endIndex - halfDistance) {
                colIdWithOffset = endIndex - this.maxViewDistance.x + colId;
            } else {
                colIdWithOffset = x - halfDistance + colId;
            }
            return Math.round(colIdWithOffset);
        },
        rowsOffset(rowId) {
            let endIndex = this.map.length;
            let halfDistance = this.maxViewDistance.y * 0.5;
            let y = this.player.y;
            let rowIdWithOffset = 0;
            if (y < halfDistance) {
                rowIdWithOffset = rowId;
            } else if (y > endIndex - halfDistance) {
                rowIdWithOffset = endIndex - this.maxViewDistance.y + rowId;
            } else {
                rowIdWithOffset = y - halfDistance + rowId;
            }
            return Math.round(rowIdWithOffset);
        },
        calcViewDistance() {
            this.maxViewDistance = {
                x: Math.ceil(window.innerWidth / this.size),
                y: Math.ceil(window.innerHeight / this.size)
            };
        }
    },
    watch: {
        'player.x': function(newValue, oldValue) {
            let pos = { x: oldValue, y: this.player.y };
            new TWEEN.Tween(pos)
                .to({x: newValue}, this.player.speed)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate((obj) => this.calcFieldOffset(obj))
                .start();
        },
        'player.y': function(newValue, oldValue) {
            let pos = { x: this.player.x, y: oldValue };
            new TWEEN.Tween(pos)
                .to({y: newValue}, this.player.speed)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate((obj) => this.calcFieldOffset(obj))
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
      perspective: 1000;
      transform: translateZ(0);
      backface-visibility: hidden;
    }
</style>
