<template>
  <base-modal
    :value="value"
    :width="800"
    @input="$emit('input', $event)"
  >
    <form
      class="p-4"
      @submit.prevent="hide()"
    >
      <h1
        class="text-xl mb-2 align-middle text-center"
      >
        <b>Task Box Help</b>
      </h1>
      
      <div class="w-full" style="white-space: pre-line;">
      <p>
        The <b>Task Box</b> is used to create <b>Tasks</b> which represent all of the things we need to do- it is a to-do list. 
        When you finish a task, you can complete it using the checkbox button on the left side of the task.
        It then will remain on your task list until you delete it.
        You can give tasks lots of different properties. Here is a list of the possibilities.
        <ol>
          <li>Due dates</li>
          <li>Activation date (prevent the task being shown in your task list until the activation date)</li>
          <li>Money value</li>
          <li>Point values (to be spent in the Reward Box)</li>
          <li>Goals (from the Goal Box, letting you sort the task list by affiliated goal)</li>
          <li>Duration (to help organize how much time tasks could take)</li>
        </ol>
      </p>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-600 py-1 px-3 text-white rounded-sm"
          @click="hide"
        >
          Done
        </button>

        <button
          class="bg-red-500 hover:bg-red-600 py-1 px-3 text-white rounded-sm"
          @click="hide"
        >
          Cancel
        </button>
      </div>
    </form>
  </base-modal>
</template>

<script>
import BaseModal from './BaseModal.vue'

export default {
  components: {
    BaseModal,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    hide() {
      this.$emit('input', false)
    },
  },
}
</script>
