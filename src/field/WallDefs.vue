<template>
    <rect class="wall"
          :x="0"
          :y="0"
          :width="size"
          :height="size"
          :size="size" />
</template>


<script>
    export default {
        name: "wall",
        props: {
            size: { type: [ Number, String ], default: 40 },
            col: { type: Number, default: 0 },
            row: { type: Number, default: 0 },
        }
    }
</script>


<style lang="scss">
    .wall {
        stroke: black;
        fill: gray;
    }
</style>
