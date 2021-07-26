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
          font-bold
          leading-tight
          text-gray-900
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
                    src="@/assets/avatar.jpg"
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
      <button
        class="
          px-1
          float-right
          inline-block
          rounded-md
          border border-gray-300
          focus:outline-none
          focus:ring-2 focus:ring-purple-600
          font-bold
          leading-tight
          text-gray-900
        "
        type="button"
        @click="copy"
      >
        ⌘ + 1
      </button>
      <h1 class="font-bold leading-tight text-gray-900">
        <!-- <img :class="$style.icon" :src="iconMaps[name]"> -->
        <img
          class="h-8 w-8 pr-2 rounded-full inline-block"
          src="@/assets/soundHover.svg"
          alt=""
          @click.stop="openSound"
        />
        {{ result.text }}
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
    timer:null,
    value: '',
    tips: false,
    isExactActive: 0,
    showProfileMenu: false,
    links: [
      { text: '自动', to: 'auto' },
      { text: '英文', to: 'en' },
      { text: '中文', to: 'zh-cn' },
    ],
  }),
  computed: {
    ...Vuex.mapState(['translateResult', 'result']),
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
      if (ctrlKey && keyCode == 83) {
        self.getTrans(this.isExactActive)
        return false
      }
    }
    utools &&
      utools.onPluginEnter(({ code, type, payload, optional }) => {
        console.log('用户进入插件', code, type, payload)
        utools &&
          utools.setSubInput(({ text }) => {
            if (text) {
              this.value = text
            }
          }, '翻译')
        if (payload) {
          this.value = payload
        }
        if (this.value) {
          setTimeout(() => {
            this.getTrans(this.isExactActive)
          }, 500)
        }
      })
  },
  watch: {
    value(val) {
      if (val) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.getTrans();
        }, 500)
        //  utools &&
        //     utools.setSubInput(({ text }) => {
        //       this.value = text
        //     }, '翻译')
        // setTimeout(() => {
        //   this.getTrans(this.isExactActive)
        // }, 500)
      }
    },
  },
  methods: {
    // 播放声音
    openSound() {
      console.log('🐛 播放声音', 22)
      this.$store.dispatch('GOOGLE_SOUND')
    },
    // 判断中英字符个数
    countnums(strings) {
      var trim = (str) =>
        (str || '').replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '') //+表示匹配一次或多次，|表示或者，\s和\u00A0匹配空白字符，/^以……开头，$以……结尾，/g全局匹配,/i忽略大小写
      let _str = trim(strings) //去除字符串的左右两边空格
      var strlength = _str.length
      if (!strlength) {
        //如果字符串长度为零，返回零
        return 0
      }
      var chinese = _str.match(/[\u4e00-\u9fa5]/g) //匹配中文，match返回包含中文的数组
      return (
        strlength - (chinese && chinese.length) > (chinese && chinese.length)
      ) //计算字符个数
    },
    getTrans(i = this.isExactActive, name = { text: '英文', to: 'auto' }) {
      this.isExactActive = i
      localStorage.setItem('language', name.to)
      if (this.value) {
        this.$store.commit('setKeyword', this.value)
        this.$store.commit('setWebLanguage', name.to)
        console.log(name.to === 'auto', this.countnums(this.value), '88')
        if (name.to === 'auto') {
          if (this.countnums(this.value)) {
            localStorage.setItem('language', 'zh-cn')
            this.$store.commit('setWebLanguage', 'zh-cn')
          } else {
            localStorage.setItem('language', 'en')
            this.$store.commit('setWebLanguage', 'en')
          }
        }
        this.translate()
      }
    },
    translate() {
      // utools&&utools.setSubInputValue(this.value)
      this.$store.dispatch('WEB_TRANSLATE_KEYWORD', this.value).catch(() => {})
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