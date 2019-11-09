<template>
  <div class="flex">
    <button
      class="border-green-500 text-gray-500 hover:text-green-500"
      @click="resetTimer()"
    >
      <rotate-cw-icon />
    </button>

    <button
      v-if="!timer"
      class="border-green-500 text-gray-500 hover:text-green-500"
      @click="startTimer()"
    >
      <play-icon />
    </button>

    <button
      v-if="timer"
      class="border-green-500 text-gray-500 hover:text-yellow-600"
      @click="stopTimer()"
    >
      <pause-icon />
    </button>

    <div
      id="timer"
      style="border-color: lightgray;"
    >
      <span id="minutes">{{ minutes }}</span>
      <span id="middle">:</span>
      <span id="seconds">{{ seconds }}</span>
    </div>

    <button
      class="border-green-500 text-gray-500 hover:text-green-500"
      @click="addMinute()"
    >
      <plus-icon />
    </button>

    <button
      class="border-green-500 text-gray-500 hover:text-green-500"
      @click="subtractMinute()"
    >
      <minus-icon />
    </button>
  </div>
</template>

<script>
import { MinusIcon, PlusIcon, PlayIcon, PauseIcon, RotateCwIcon } from 'vue-feather-icons'

export default {
  components: { MinusIcon, PlusIcon, PlayIcon, PauseIcon, RotateCwIcon },
  data() {
    return {
      timer: null,
      totalTime: 25 * 60,
      resetButton: false,
      time: 0,
    }
  },
  computed: {
    minutes() {
      const minutes = Math.floor(this.totalTime / 60)
      return this.padTime(minutes)
    },
    seconds() {
      const seconds = this.totalTime - (this.minutes * 60)
      return this.padTime(seconds)
    },
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.countdown(), 1000)
      this.resetButton = true
    },
    stopTimer() {
      clearInterval(this.timer)
      this.timer = null
      this.resetButton = true
    },
    resetTimer() {
      this.totalTime = (25 * 60)
      clearInterval(this.timer)
      this.timer = null
      this.resetButton = false
    },
    padTime: function(time) {
      return (time < 10 ? '0' : '') + time
    },
    countdown() {
      this.totalTime--
    },
    addMinute() {
      this.totalTime += 60
    },
    subtractMinute() {
      this.totalTime -= 60
    },
  },
}
</script>
