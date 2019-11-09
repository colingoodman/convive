<template>
  <div
    class="shadow-lg bg-white rounded-lg"
    style="white-space: nowrap; -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
             break-inside: avoid;"
  >
    <!-- taskbox -->
    <h2 class="p-2 bg-gray-200 border-b-2 border-pink-500">
      <button-toggle-box
        v-model="expanded"
        expanded-class="text-pink-500"
        minimized-class="hover:text-pink-500"
      >
        <message-square-icon />
      </button-toggle-box>

      <span class="text-gray-600 uppercase tracking-wide font-medium text-sm">Feedback Box</span>
    </h2>

    <form
      v-show="expanded"
      class="flex my-2"
      @submit.prevent="addPost"
    >
      <input
        v-model="newPost"
        class="flex-grow px-3 outline-none"
        type="text"
        placeholder="New Post"
      >
      <button
        type="submit"
        class="px-2 text-gray-500 hover:text-green-500"
      >
        <plus-icon />
      </button>
    </form>

    <div
      class=""
      style="-webkit-column-break-inside: avoid;
                          page-break-inside: avoid;
                              break-inside: avoid;"
    >
      <ol
        v-show="expanded"
      >
        <li
          v-for="(post, i) in posts.slice().reverse()"
          :key="post._id"
          class="flex py-2 items-center bg-gray-100 text-left"
          :class="{ 'bg-gray-200': !(i % 2) }"
          style="padding-left: 4px;"
        >
          <p
            class="whitespace-normal flex-grow"
          >
            {{ post.item }}
          </p>

          <div
            class="flex-shrink-0 text-gray-500"
            style="white-space: nowrap"
          >
            <span
              class="text-blue-800 truncate bg-green-400 px-2"
              :style="{ backgroundColor: [post.colorHex] }"
            >{{ post.userEmail }}</span>
            <span class="hidden sm:inline">{{ post.createdAt | moment("MM/DD/YY") }}</span>
            <span class="sm:hidden">{{ post.createdAt | moment('MMM Do YY') }}</span>
          </div>
        </li>
      </ol>

      <div
        v-show="posts.length==0"
        class="row alert alert-info text-center"
      >
        <p
          class="alert alert-info"
          style="color: lightgray"
        >
          The Task Box is empty. The place for the first post is open!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { MessageSquareIcon, PlusIcon } from 'vue-feather-icons'

import ButtonToggleBox from './widgets/ButtonToggleBox.vue'

export default {

  components: {
    ButtonToggleBox, MessageSquareIcon, PlusIcon,
  },
  data() {
    return {
      posts: [],
      newPost: '',
      expanded: false,
      box: 'Feedback',
    }
  },

  created() {
    this.fetchPosts()
  },

  methods: {
    addPost() {
      let param = {
        item: this.newPost,
      }
      axios
        .post('/addPost', param)
        .then(() => {
          this.clearPost()
          this.fetchPosts()
        })
    },
    clearPost() {
      this.newPost = ''
    },
    fetchPosts() {
      axios.get('/allPosts').then(response => {
        this.posts = response.data
      })
    },
  },
}

</script>
