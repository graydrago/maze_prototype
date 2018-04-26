<template>
  <div id="app">
      <div class="viewer">
          <field v-if="map"
              :size="size"
              :player="player"
              :map="map"/>
      </div>
      <transition name="guide">
          <guide v-if="isGuideVisible"/>
      </transition>
  </div>
</template>


<script>
import TWEEN from "@tweenjs/tween.js";

let findPlayerCoors = (map) => {
    let x = 0;
    let y = 0;
    for (let row of map) {
        for (let col of row) {
            if (col === 'p') {
                return {x, y};
            }
            x += 1;
        }
        x = 0;
        y += 1;
    }

    throw new Error("Player not found!");
}

let mapRotation = (() => {
    let mapList = [
        '/dist/maps/tutorial.json',
        '/dist/maps/map.json',
        '/dist/maps/map2.json'
    ];
    let id = 0;
    return () => {
        let map = mapList[id];
        id += 1;
        if (mapList.length <= id) {
            id = 0;
        }
        return map;
    }
})();

export default {
    name: 'app',
    data () {
        return {
            size: 100,
            player: {
                x: 0,
                y: 0,
                speed: 150,
                hasControl: false
            },
            finish: null,
            map: null,
            play: true,
            control: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            isGuideVisible: true,
            isMapLoading: true
        }
    },
    created() {
        window.addEventListener("keydown", this.keyHandling(true));
        window.addEventListener("keyup", this.keyHandling(false));
        let hideGuide = () => {
            if (["KeyD"].includes(event.code)) {
                this.isGuideVisible = false;
                window.removeEventListener("keyup", hideGuide);
            }
        };
        window.addEventListener("keyup", hideGuide);
    },
    beforeDestroy() {
        this.play = false;
    },
    mounted() {
        this.loadMap(mapRotation());
        let anim = (time) => {
            this.play && requestAnimationFrame(anim);
            TWEEN.update(time);
            if (this.isMapLoading) {
                return;
            }
            if (this.checkWinCondition()) {
                this.isMapLoading = true;
                this.loadMap(mapRotation());
            }
            this.handlePlayerMovement();
        }
        requestAnimationFrame(anim);
    },
    methods: {
        keyHandling(value) {
            return (event) => {
                let size = this.$data.size;
                let player = {...this.$data.player};

                if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
                    event.preventDefault();
                }

                switch (event.code) {
                    case "KeyW": this.control.up = value; break;
                    case "KeyA": this.control.left = value; break;
                    case "KeyS": this.control.down = value; break;
                    case "KeyD": this.control.right = value; break;
                }
            }
        },
        loadMap(mapName) {
            this.player.hasControl = false;
            let request = fetch(mapName);
            request
                .then((response) => {
                    return response.json();
                })
                .then((rowMap) => {
                    this.map = rowMap.map.map((row) => row.split(''));
                    let {x, y} = findPlayerCoors(this.map);
                    this.player.x = x;
                    this.player.y = y;
                    setTimeout(() => {
                        this.player.hasControl = true;
                        this.isMapLoading = false;
                    }, 100);
                });
        },
        handlePlayerMovement() {
            if (this.player.hasControl) {
                let coord = {
                    x: this.player.x,
                    y: this.player.y
                }
                if (this.control.left) {
                    coord.x -= 1;
                } else if (this.control.right) {
                    coord.x += 1;
                } else if (this.control.up) {
                    coord.y -= 1;
                } else if (this.control.down) {
                    coord.y += 1;
                }
                if (this.map[this.player.y][coord.x] === 'w') {
                    coord.x = this.player.x;
                }
                if (this.map[coord.y][this.player.x] === 'w') {
                    coord.y = this.player.y;
                }
                this.player.x = coord.x;
                this.player.y = coord.y;
            }
        },
        checkWinCondition() {
            if (this.player.hasControl) {
                if (this.map[this.player.y][this.player.x] === 'f') {
                    return true;
                }
            }
            return false;
        }
    }
}
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body * {
    pointer-events: none;
}

svg {
    image-rendering: optimizeSpeed;             /* STOP SMOOTHING, GIVE ME SPEED  */
    image-rendering: -moz-crisp-edges;          /* Firefox                        */
    image-rendering: -o-crisp-edges;            /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated;                 /* Chrome */
    image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
    -ms-interpolation-mode: nearest-neighbor;   /* IE8+                           */
}

.guide {
    &-leave-active {
        transition: opacity 0.4s;
    }

    &-leave-to {
        opacity: 0;
    }
}
</style>
