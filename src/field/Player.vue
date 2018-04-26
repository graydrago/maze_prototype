<template>
    <g v-bind:transform="transform">
        <svg :fill="color"
             :height="size"
             :width="size"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="12" cy="12" r="8" fill="white"/>
            <circle cx="15.5" cy="9.5" r="1.5"/>
            <circle cx="8.5" cy="9.5" r="1.5"/>
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-4c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z"/>
        </svg>
    </g>
</template>


<script>
    import TWEEN from "@tweenjs/tween.js"

    export default {
        name: "player",

        props: {
            size: { type: [ Number, String ], default: 40 },
            col: { type: Number, default: 0 },
            row: { type: Number, default: 0 },
            color: { type: String, default: 'green' },
            player: { type: Object }
        },

        data: function () {
            return {
                x: 0,
                y: 0,
                play: true,
            }
        },

        mounted: function() {
            this.x = this.player.x * this.size;
            this.y = this.player.y * this.size;
        },

        computed: {
            transform() {
                let {x, y} = this.$data;
                return `translate(${x}, ${y})`;
            }
        },

        watch: {
            'player.x': function(newValue) {
                this.player.hasControl = false;
                new TWEEN.Tween(this.$data)
                  .to({x: newValue * this.size}, this.player.speed)
                  .easing(TWEEN.Easing.Linear.None)
                  .onComplete(() => { this.player.hasControl = true; })
                  .start();
            },
            'player.y': function(newValue) {
                this.player.hasControl = false;
                new TWEEN.Tween(this.$data)
                  .to({y: newValue * this.size}, this.player.speed)
                  .easing(TWEEN.Easing.Linear.None)
                  .onComplete(() => { this.player.hasControl = true; })
                  .start();
            },
            size: function(newValue) {
                this.$data.x = this.col * newValue;
                this.$data.y = this.row * newValue;
            }
        },
    }
</script>


<style lang="scss">
</style>
