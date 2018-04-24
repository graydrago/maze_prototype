<template>
   <use :href="href"
        :x="x"
        :y="y"/>
</template>


<script>
export default {
    name: "cell",
    props: {
        size: { type: [ Number, String ], default: 40 },
        href: { type: [ String ] },
        col: { type: Number, default: 0 },
        row: { type: Number, default: 0 },
    },
    computed: {
        x() { return this.col * this.size; },
        y() { return this.row * this.size; }
    }
}
</script>
