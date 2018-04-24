<template>
  <div id="app">
      <div class="viewer">
          <field
              :size="size"
              :margin="margin"
              :player="player"
              :map="map"/>
      </div>
  </div>
</template>


<script>
let map = [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w                                              w',
    'w     w                                        w',
    'w p              wwwwww wwwwwwww wwwwww        w',
    'w                w    w w      w w    w        w',
    'w                w    w w      w w    w        w',
    'w     w          w    w w      w w    w        w',
    'w   k w          wwwwww w      w w    w        w',
    'w                       w      w w    w        w',
    'wwwww www        wwwwww w      w w    w        w',
    '    w w w        w    w w      w w    w        w',
    '    w www        w    w w      w w    w        w',
    '  www            w    w w      w w    w        w',
    '  w              w    w wwwwwwww wwwwww        w',
    '  w www          w    w                        w',
    '  w w w          wwwwww                        w',
    '  w w w                                        w',
    '  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
];

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
map = map.map((row) => row.split(''));
console.log("!!!", findPlayerCoors(map))

export default {
    name: 'app',
    data () {
        return {
            size: 100,
            margin: 10,
            player: findPlayerCoors(map),
            map,
        }
    },

    created: function() {
        let savedTime = Date.now();
        window.addEventListener("keydown", (event) => {
            let now = Date.now()
            if (now - savedTime >= 200) {
                this.keyHandling(event);
                savedTime = now;
            }
        });
    },

    beforeDestroy: function() {
        window.removeEventListener("keydown", this.keyHandling);
    },

    methods: {
        keyHandling: function(event) {
            let size = this.$data.size;
            let player = {...this.$data.player};

            if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
                event.preventDefault();
            }

            switch (event.code) {
                case "KeyW": player.y -= 1; break;
                case "KeyA": player.x -= 1; break;
                case "KeyS": player.y += 1; break;
                case "KeyD": player.x += 1; break;
            }

            if (this.$data.map[player.y][player.x] === 'w') {
            } else {
                this.$data.player.x = player.x;
                this.$data.player.y = player.y;
            }
        },
    },
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

[type=range] {
    width: 300px;
}
</style>
