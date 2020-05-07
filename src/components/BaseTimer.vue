<template>
    <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
                <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                <path
                        :stroke-dasharray="circleDasharray"
                        class="base-timer__path-remaining"
                        :class="remainingPathColor"
                        d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
                ></path>
            </g>
        </svg>
        <p class="base-timer__label" @click="handlePause">
            <span v-if="!this.isPaused" class="font-weight-bold" :style="`color:${this.remainingPathColor}`">{{ formattedTimeLeft }}</span>
            <span v-if="this.isPaused" :style="`color:${this.remainingPathColor}`">
                <FontAwesomeIcon icon="play" v-if="!this.isFinished"/>
                <FontAwesomeIcon icon="sync" v-if="this.isFinished"/>
            </span>
        </p>
    </div>
</template>

<script>
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    const TIME_LIMIT = 15;

    export default {
        data() {
            return {
                timePassed: 0,
                timerInterval: null,
                isPaused: true
            };
        },
        props: {
            timerResetProp: String,
            pauseTimer: String,
            isFinished:Boolean
        },
        computed: {
            circleDasharray() {
                return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
            },

            formattedTimeLeft() {
                const timeLeft = this.timeLeft;
                //const minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;

                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }

//                return `${minutes}:${seconds}`;
                return `${seconds}`;
            },

            timeLeft() {
                return TIME_LIMIT - this.timePassed;
            },

            timeFraction() {
                const rawTimeFraction = this.timeLeft / TIME_LIMIT;
                return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
            },

            remainingPathColor() {
                const {alert, warning, info} = COLOR_CODES;

                if (this.timeLeft <= alert.threshold) {
                    return alert.color;
                } else if (this.timeLeft <= warning.threshold) {
                    return warning.color;
                } else {
                    return info.color;
                }
            }
        },

        watch: {
            timeLeft(newValue) {
                if (newValue === 0) {
                    this.onTimesUp();
                }
                this.$emit("calculateQuestionPoint", Math.ceil(newValue / 5));

            },
            timerResetProp: {
                immediate: true,
                deep: true,
                handler() {
                    this.timePassed = 0;
                }
            },
            pauseTimer: {
                immediate: true,
                deep: true,
                handler() {
                    clearInterval(this.timerInterval);
                    this.isPaused = true;
                }
            }
        },

        mounted() {
            if (!this.isPaused &&!this.isFinished)
                this.startTimer();
        },

        methods: {
            onTimesUp() {
                clearInterval(this.timerInterval);
                this.$emit("timeUp");
                this.timePassed = 0;
                this.startTimer();
            },

            startTimer() {
                var appvue = this;
                this.timerInterval = setInterval(function () {
                    appvue.$emit("timerTick");
                    appvue.timePassed += 1;
                }, 1000);
            },
            handlePause: function () {
                if (!this.isFinished) {
                    if (!this.isPaused)
                        clearInterval(this.timerInterval);
                    else
                        this.startTimer();

                    this.isPaused = !this.isPaused

                    this.$emit("handlePause", this.isPaused);
                }else{
                    this.isPaused = true;
                    clearInterval(this.timerInterval);
                    this.timePassed = 0;
                    this.$emit("handleReset");
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .base-timer {
        position: relative;
        width: 50px;
        height: 50px;

        &__svg {
            transform: scaleX(-1);
        }

        &__circle {
            fill: none;
            stroke: none;
        }

        &__path-elapsed {
            stroke-width: 7px;
            stroke: #ffffff;
        }

        &__path-remaining {
            stroke-width: 7px;
            stroke-linecap: round;
            transform: rotate(90deg);
            transform-origin: center;
            transition: 1s linear all;
            fill-rule: nonzero;
            stroke: currentColor;

            &.green {
                color: rgb(64, 149, 97);
            }

            &.orange {
                color: #d5d167;
            }

            &.red {
                color: #e04848;
            }
        }

        &__label {
            position: absolute;
            width: 50px;
            height: 50px;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
    }
</style>
