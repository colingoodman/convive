<template>
  <div
    id="app"
    class="bg-grey-100 justify-center"
    :style="{ backgroundColor: this.$store.settings.colorHex }"
  >
    <div
      v-if="$store.user"
      id="boxContainer"
      :style="{ backgroundColor: this.$store.settings.colorHex }"
    >
      <task-box
        v-if="$store.user"
        style="margin-bottom: 16px;"
      />

      <routine-box
        v-if="this.routinesLoaded"
        style="margin-bottom: 16px;"
      />

      <journal-box
        v-if="$store.user"
        style="margin-bottom: 16px;"
      />

      <feedback-box
        v-if="$store.none"
        style="margin-bottom: 16px;"
      />

      <goal-box
        v-if="this.goalsLoaded"
        style="margin-bottom: 16px;"
      />

      <list-box
        v-if="$store.user"
        style="margin-bottom: 16px;"
      />

      <subscription-box
        v-if="$store.user"
        style="margin-bottom: 16px;"
      />

      <reward-box
        v-if="$store.user"
        style="margin-bottom: 16px;"
      />

      <!-- contact box -->
      <!-- status box -->
    </div>
  </div>
</template>

<script>

import TaskBox from './TaskBox.vue'
import RoutineBox from './RoutineBox.vue'
import FeedbackBox from './FeedbackBox.vue'
import JournalBox from './JournalBox.vue'
import GoalBox from './GoalBox.vue'
import ListBox from './ListBox.vue'
import SubscriptionBox from './SubscriptionBox.vue'
import RewardBox from './RewardBox.vue'

import axios from 'axios'

export default {
  name: 'Toolbox',
  components: {
    TaskBox,
    RoutineBox,
    FeedbackBox,
    JournalBox,
    GoalBox,
    ListBox,
    SubscriptionBox,
    RewardBox,
  },
  data: function() {
    return {
      goalsLoaded: false,
      routinesLoaded: false,
    }
  },
  created() {
    this.redirect()
    axios.get('/goals').then(response => {
      this.$store.goals = response.data
      this.goalsLoaded = true
    })
    axios.get('/routines').then(response => {
      this.$store.routines = response.data
      this.routinesLoaded = true
    })
  },
  methods: {
    redirect() {
      if (!this.$store.user) { this.$router.push('/auth') }
    },
  },
}
</script>

<style>
#boxContainer {
  padding: 16px;
  columns: 3;
  column-gap: 16px;
  break-inside: avoid;
  box-sizing: border-box;
  min-height: 50%;
  width: 100%;
}

@media (max-width: 1650px) {
  #boxContainer {
    columns: 3;
  }
}

@media (max-width: 1150px) {
  #boxContainer {
    columns: 2;
  }
}

@media (max-width: 750px) {
  #boxContainer {
    columns: 1;
  }
}
</style>
