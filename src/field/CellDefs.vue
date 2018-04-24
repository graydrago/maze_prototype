<template>
    <circle class="cell"
        v-bind:cx="radius"
        v-bind:cy="radius"
        v-bind:r="radius / 10" />
</template>


<script>
export default {
    name: "cell-defs",
    props: {
        size: { type: [ Number, String ], default: 40 },
    },
    computed: {
        radius () {
            return this.size / 2;
        }
    }
}
</script>


<style lang="scss">
    .cell {
        fill: lightgray;
    }
</style>
