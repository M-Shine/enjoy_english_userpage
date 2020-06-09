<template>
    <div id="app">
        <div class="header">乐享英语</div>
        <transition>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: "App",
    components: {}
};
</script>

<style scoped>
.header {
    font-weight: bolder;
    font-size: 2em;
    text-align: center;
    letter-spacing: 10px;
    text-indent: 10px;
    padding: 5px 0px 5px 0px;
    border-bottom: 1px #ccc solid;
}

.v-enter {
    opacity: 0;
    transform: translateX(100%);
}

.v-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    position: absolute;
}

.v-enter-active,
.v-leave-active {
    transition: all 0.25s ease;
}
</style>
