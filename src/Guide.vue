<template>
    <div class="guide">
        <p>
            <b>W</b>, <b>A</b>, <b>S</b>, <b>D</b> - It's what moves me!
        </p>
    </div>
</template>


<script>
export default {
    name: "guide"
}
</script>


<style lang="scss">
    .guide {
        position: absolute;
        left: 50%;
        top: 30%;
        transform: translate(-50%, -50%);
        border-radius: 30px;
        border: 10px green solid;
        padding: 30px;
        background-color: white;
    }
</style>
