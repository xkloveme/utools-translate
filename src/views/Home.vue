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
        placeholder="翻译的内容"
      ></textarea>
    </div>
  </main>
  <nav class="bg-gray-800">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="md:block">
            <div class="ml-10 flex items-baseline">
              <div v-for="(item, i) in links" :key="i" custom>
                <a
                  @click="getTrans(item, i)"
                  class="
                    px-5
                    py-4
                    rounded-md
                    text-sm
                    font-medium
                    cursor-pointer
                  "
                  :class="[
                    isExactActive === i
                      ? 'text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700'
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

  <header class="bg-white shadow" v-if="res.text">
    <div
      class="max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8 cursor-pointer"
      @click="copy"
    >
      <h1 class="text-3xl font-bold leading-tight text-gray-900">
        {{ res.text }}
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
</template>

<script>
import { defineComponent } from 'vue'
import Vuex from 'vuex'
import { translate } from './../google-translate-cn-api/lib/index.js'
export default defineComponent({
  data: () => ({
    value: '',
    isExactActive: 0,
    showProfileMenu: false,
    links: [
      { text: '英文', to: 'en' },
      { text: '中文', to: 'zh-cn' },
    ],
    res: {
      text: '',
      from: {
        language: { didYouMean: false, iso: 'zh-CN' },
        text: { autoCorrected: false, value: '你好世界', didYouMean: true },
      },
      raw: '',
    },
  }),
  components:{Toast},
  computed: {
    ...Vuex.mapState(['keyword', 'completeList']),
  },
  mounted() {
    // this.$store.commit('setKeyword', this.value)
    // this.$store.dispatch('AUTO_COMPLETE')
    utools &&
      utools.setSubInput(({ text }) => {
        this.value = text
        if (text) {
          setTimeout(() => {
            this.getTrans(text)
          }, 500)
        }
      }, '翻译')
  },
  methods: {
    getTrans(name, i = 0) {
      this.isExactActive = i
      console.log(
        '🐛 ~ file: Home.vue ~ line 286 ~ getTrans ~ name',
        this.value
      )
      translate(this.value, { to: name.to })
        .then((res) => {
          if (res) {
            this.res = res
          }
        })
        .catch(console.error)
    },
    open(url) {
      window.openExternal(url)
    },
    copy() {
      console.log('复制成功')
      this.getValue()
      utools&&utools.copyText(this.value)
      utools&&utools.showNotification('复制成功')
    },
    getValue(){
      const textarea = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = this.value
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      const result = document.execCommand('Copy')
      if(result){
        console.log('复制成功')
      }
    }
  },
})
</script>