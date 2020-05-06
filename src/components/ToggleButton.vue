<template>
    <div class="ToggleButton" :class="this.alignData">
        <label class="switch" :class="toggleSize">
            <input type="checkbox" :checked="this.isCheckedComputed" @change="handleChange">
            <span :style="this.toggleColor" class="slider round" :class="toggleSize"></span>
        </label>
    </div>
</template>

<script>
    export default {
        props: {
            isChecked: Boolean,
            toggleCheckedColor: String,
            toggleUncheckedColor: String,
            align:String,
            toggleSize:String
        },
        data() {
            return {
                toggleStyle: "",
                toggleCheckedColorData:"background-color:darkgreen",
                toggleUnCheckedColorData: "background-color:gray",
                isCheckedData:this.isChecked
        }
        },
        computed: {
            toggleColor: function () {
                return this.isCheckedData ? this.toggleCheckedColorData : this.toggleUnCheckedColorData
            },
            isCheckedComputed: function () {
                return this.isCheckedData ? "checked": ""
            },
            alignData:function () {
                return "text-"+this.align;
            }
        },
        mounted() {

        },
        methods: {
            handleChange: function () {
                this.isCheckedData = !this.isCheckedData
                this.$emit("handleChangeToggleEvent")
            },
        }
    };
</script>

<style>
    .switch {
        position: relative;
        display: inline-block;
    }
    .toggle-lg {
        width: 64px;
        height: 36px;
    }
    .toggle-md {
        width: 48px;
        height: 24px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }
    .slider.toggle-lg:before {
        height: 28px;
        width: 28px;
    }

    .slider.toggle-md:before {
        height: 16px;
        width: 16px;
    }

    input:checked + .slider {
        background-color: darkgreen;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.toggle-lg.round {
        border-radius: 28px;
    }
    .slider.toggle-md.round {
        border-radius: 24px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

</style>
