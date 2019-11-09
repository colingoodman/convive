import Vue from 'vue'

export default Vue.observable({
  user: null,
  settings: {
    colorHex: '#647C64',
    taskBox: {
      showDeleteButton: Boolean,
      showDeactivated: Boolean,
    },
  },
  highlightRoutineID: null,
  highlightGoalID: null,
  Item: {},
})

// this.messages.push(newMessage)

// messageList.appendElement()
