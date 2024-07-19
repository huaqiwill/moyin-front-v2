import { defineStore } from 'pinia'
import {
  getStoreSearchCriteria as getStoreSearchCriteriaApi,
  getSpeakerEmotionList as getSpeakerEmotionListApi,
  searchSpeakers as searchSpeakersApi,
} from '@/api/moyin'

export const useDubbingStore = defineStore('dubbing', {
  state: () => {
    return {
      /**
       * 配音文字
       */
      dubbingText: '',
      /**
       * 选中的配音文字
       */
      dubbingSelectedText: '',
      // 当前光标位置
      dubbingSelectedIndex: 0,
      // 当前选中的文本长度
      dubbingSelectedLength: 0,

      // 编辑器实例
      editorRef: null,
      // 音量，默认为 50
      dubbingVolume: 50,
      // 编辑器实例
      quillEditorRef: null,

      //
      ssmlRef: '',
      ssmlFormatRef: '',

      /**
       * 搜索条件
       */
      storeSearchCriteria: null,
      /**
       * 情绪列表
       */
      speakerEmotionList: null,
      /**
       * 领域列表
       */
      domainList: [],
      /**
       * 配音员列表
       */
      searchSpeakerList: [],
      /**
       * 全局配音员
       */
      globalSpeaker: null,
      /**
       * 全局语速
       */
      globalSpeed: 1,
      /**
       * 全局语调
       */
      globalIntonation: 0,
    }
  },
  getters: {},
  actions: {
    /**
     * 获取全部搜索条件
     */
    async getStoreSearchCriteria() {
      const res = await getStoreSearchCriteriaApi()
      this.storeSearchCriteria = res.data
      this.domainList = res.data['全部领域:domainId']
    },
    /**
     * 获取配音员情绪列表
     */
    async getSpeakerEmotionList() {
      const res = await getSpeakerEmotionListApi()
      this.speakerEmotionList = res.data
    },
    /**
     * 配音员列表
     * @param queryParams
     * @param isAppend
     * @returns
     */
    async searchSpeakers(queryParams: any, isAppend: boolean = false) {
      return searchSpeakersApi(queryParams).then((res) => {
        if (isAppend) {
          this.searchSpeakerList.push(...res.data.results)
        } else {
          this.searchSpeakerList = res.data.results
        }
      })
    },
  },
})
