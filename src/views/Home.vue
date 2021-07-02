<template>
  <main>
    <div>
      <textarea
        rows="10"
        class="
          shadow-sm
          focus:ring-indigo-500
          focus-visible:ring-indigo-500
          focus:border-indigo-500
          focus-visible:border-indigo-500
          focus:outline-none
          focus:ring-2 focus:ring-purple-600
          focus:border-transparent
          block
          w-full
          sm:text-sm
          border border-gray-300
          rounded-md
        "
        v-model="value"
        @click.enter="getTrans()"
        placeholder="翻译的内容"
      ></textarea>
    </div>
  </main>
  <nav class="bg-gray-800">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between h-12">
        <div class="flex items-center">
          <div class="md:block">
            <div class="ml-10 flex items-baseline">
              <div v-for="(item, i) in links" :key="i" custom>
                <a
                  @click="getTrans(i, item)"
                  class="
                    px-5
                    py-2
                    rounded-md
                    text-sm
                    font-medium
                    cursor-pointer
                  "
                  :class="[
                    isExactActive === i
                      ? 'text-white bg-purple-600 focus:outline-none focus:text-white focus:bg-gray-700'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700',
                    i > 0 && 'ml-4',
                  ]"
                  >{{ item.text }}</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button
                  class="
                    max-w-xs
                    flex
                    items-center
                    text-sm
                    rounded-full
                    text-white
                    focus:outline-none
                    focus:shadow-solid
                  "
                  id="user-menu"
                  aria-label="User menu"
                  aria-haspopup="true"
                  @click="open('https://github.com/xkloveme/utools-translate')"
                >
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://www.jixiaokang.com/medias/avatar.jpg"
                    alt=""
                  />
                </button>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showProfileMenu"
                  class="
                    origin-top-right
                    absolute
                    right-0
                    mt-2
                    w-48
                    rounded-md
                    shadow-lg
                  "
                >
                  <div
                    class="
                      py-1
                      rounded-md
                      bg-white
                      ring-1 ring-black ring-opacity-5
                    "
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <a
                      href="#"
                      class="
                        block
                        px-4
                        py-2
                        text-sm text-gray-700
                        hover:bg-gray-100
                      "
                      role="menuitem"
                      >Your Profile</a
                    >
                    <a
                      href="#"
                      class="
                        block
                        px-4
                        py-2
                        text-sm text-gray-700
                        hover:bg-gray-100
                      "
                      role="menuitem"
                      >Settings</a
                    >
                    <a
                      href="#"
                      class="
                        block
                        px-4
                        py-2
                        text-sm text-gray-700
                        hover:bg-gray-100
                      "
                      role="menuitem"
                      >Sign out</a
                    >
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <header class="bg-white shadow" v-if="result.text">
    <div
      class="max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8 cursor-pointer"
      @click="copy"
    >
      <h1 class="text-3xl font-bold leading-tight text-gray-900">
        {{ result.text }}
        <button
          class="
            px-1
            float-right
            inline-block
            rounded-md
            border border-gray-300
            focus:outline-none
            focus:ring-2 focus:ring-purple-600
          "
          type="button"
          @click="copy"
        >
          ⌘ + 1
        </button>
      </h1>
    </div>
  </header>

  <div
    v-if="tips"
    class="
      fixed
      right-1
      top-1
      animate-pulse
      flex
      w-full
      max-w-xs
      mx-auto
      overflow-hidden
      bg-white
      rounded-lg
      shadow-md
      dark:bg-gray-800
    "
  >
    <div class="flex items-center justify-center w-12 bg-green-500">
      <svg
        class="w-6 h-6 text-white fill-current"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
        />
      </svg>
    </div>

    <div class="px-4 py-2 -mx-3">
      <div class="mx-3">
        <span class="font-semibold text-green-500 dark:text-green-400"
          >成功</span
        >
        <p class="text-sm text-gray-600 dark:text-gray-200">您已经复制成功!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Vuex from 'vuex'
// import { translate } from './../google-translate-cn-api/lib/index.js'
export default defineComponent({
  data: () => ({
    value: '',
    tips: false,
    isExactActive: 0,
    showProfileMenu: false,
    links: [
      { text: '英文', to: 'en' },
      { text: '中文', to: 'zh-cn' },
    ],
  }),
  computed: {
    ...Vuex.mapState(['translateResult','result']),
  },
  mounted() {
    let self = this
    document.onkeydown = function (e) {
      var keyCode = e.keyCode || e.which || e.charCode
      var ctrlKey = e.ctrlKey || e.metaKey
      if (ctrlKey && keyCode == 49) {
        self.copy()
        return false
      }
    }
    utools &&
      utools.setSubInput(({ text }) => {
        this.value = text
        if (text) {
          setTimeout(() => {
            this.getTrans(this.isExactActive)
          }, 500)
        }
      }, '翻译')
  },
  methods: {
    getTrans(i = this.isExactActive, name = { text: '英文', to: 'en' }) {
      this.isExactActive = i
      localStorage.setItem("language",name.to)
      if (this.value) {
        this.$store.commit('setKeyword', this.value)
        this.$store.commit('setWebLanguage', name.to)
        this.translate()
      }
    },
    translate() {
      this.$store.dispatch('WEB_TRANSLATE_KEYWORD',this.value).catch(() => {})
    },
    open(url) {
      window.openExternal(url)
    },
    copy() {
      this.getValue()
      utools && utools.copyText(this.res.text)
      // utools && utools.showNotification('复制成功')
    },
    getValue() {
      this.tips = true
      const textarea = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = ''
      textarea.value = this.result.text
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      const result = document.execCommand('Copy')
      if (result) {
        console.log('复制成功')
      }
      setTimeout(() => {
        this.tips = false
      }, 800)
    },
  },
})
</script>