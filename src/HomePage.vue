<template>
    <div id="app">
        <Maps/>
    </div>
</template>

<script>
    import Maps from "./components/Maps";

    export default {
        name: 'App',
        components: {
            Maps,
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
