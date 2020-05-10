<template>
    <div class="text-center">
        <span class="p-1"  v-if="!isTextVisible">
            <FontAwesomeIcon :icon="icon" :size="size" class="level mr-2 " :class="selectedLevelClass"
                             v-for="index in currentLevel"
                             :key="index"
                             @click="handleLevelChange(index, true)"/>

            <FontAwesomeIcon :icon="icon" :size="size" class="level mr-2" :class="unselectedLevelClass"
                             v-for="level in  (maxLevel-currentLevel)"
                             :key="currentLevel+level"
                             @click="handleLevelChange(currentLevel+level,false)"/>
        </span>
    <p v-if="isTextVisible"><b>{{convertLevelToStr}}</b> Seviyede Oynadınız</p>
    <p v-if="!isTextVisible"><b>{{convertLevelToStr}}</b></p>
    </div>
</template>

<script>
    export default {
        props: {
            icon:String,
            maxLevel:Number,
            currentLevel:Number,
            selectedLevelClass:String,
            unselectedLevelClass:String,
            size:String,
            isTextVisible:Boolean
        },
        methods:{
            handleLevelChange:function (index) {
                this.$emit("handleLevelChange", index);
            }
        },
        computed:{
            convertLevelToStr:function () {
                let zorlukStr = ["Kolay", "Orta","Zor"];
                return zorlukStr[this.currentLevel-1];
            }
        }
    };
</script>
<style>
    .level{

    }

</style>
