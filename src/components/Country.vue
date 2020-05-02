<template>
        <g  :id="this.country.id"
            :key="this.country.id"
            :class="this.country.id"
            class="country"
            :plaka="this.country.plaka"
            :alankodu="this.country.alankodu"
            :adi="this.country.adi"
            :data-iladi="this.country.adi"
            @click="handleCountryClick">
            <path class="countryPath" :key="indexPath" v-for="(path, indexPath) in this.country.path" :d="path"/>
        </g>
</template>

<script>
    export default {
        name: 'Country',
        props: {
            country: Object
        },
        data(){
            return {

            }
        },
        methods:{
            handleCountryClick: function () {
                this.$emit("countryClick", this);
            }
        }
    };
</script>
