<template>
    <g v-bind:transform="transform">
        <svg :fill="color"
             :height="size"
             :width="size"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
    </g>
</template>


<script>
    import TWEEN from "@tweenjs/tween.js"

    export default {
        name: "key",

        props: {
            size: { type: [ Number, String ], default: 40 },
            col: { type: Number, default: 0 },
            row: { type: Number, default: 0 },
            color: { type: String, default: 'green' }
        },

        data: function () {
            return {
                x: 0,
                y: 0,
                play: true,
            }
        },

        mounted: function() {
            this.$data.x = this.col * this.size;
            this.$data.y = this.row * this.size;
            let anim = (time) => {
                this.play && requestAnimationFrame(anim);
                TWEEN.update(time);
            }
            requestAnimationFrame(anim);
        },

        computed: {
            transform() {
                let { x, y } = this.$data;
                return `translate(${x}, ${y})`;
            }
        },

        watch: {
            col: function(newValue) {
                new TWEEN.Tween(this.$data)
                    .to({x: newValue * this.size}, 100)
                    .start();
            },
            row: function(newValue) {
                new TWEEN.Tween(this.$data)
                    .to({y: newValue * this.size}, 100)
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

