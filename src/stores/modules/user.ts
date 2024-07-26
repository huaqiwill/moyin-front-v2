import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      isLogin: false,
      isPlaying: false,
      currentSong: {},
      currentSongIndex: 0,
      songList: [],
      isShow: false,
      isShowPlayList: false,
      isShowLyric: false,
      isShowComment: false,
      isShowSearch: false,
      isShowMv: false,
      isShowMvList: false,
      isShowMvDetail: false,
      isShowMvPlay: false,
    }
  },
  getters: {},
  actions: {
    async login(loginForm: object) {
      return await userLogin(loginForm).then((res: any) => {
        setToken(res.token)
        router.push({ path: '/' }).catch(() => {})
        this.isLogin = true
        this.token = res.token
      })
    },
    logout() {
      userLogout().then(() => {
        this.isLogin = false
        this.token = ''
        removeToken()
        router.push({
          name: 'login',
        })
      })
    },
  },
})
