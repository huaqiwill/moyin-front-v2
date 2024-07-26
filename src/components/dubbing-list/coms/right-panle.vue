<template>
  <div
    style="height: 100%; width: 100%; padding: 10px; font-size: 0.65rem"
    class="right-panle px-3 text-black overflow-x-hidden overflow-y-auto scrollbar-none position-relative"
  >
    <div class="d-flex text-center justify-content-between align-items-center pe-4">
      <div class="me-auto d-flex flex-row align-items-center">
        <PlayButton :size="42"></PlayButton>
        <div
          class="ms-2 d-flex flex-column justify-content-between"
          style="height: 42px; font-size: 14px"
        >
          <div class="d-flex dlex-row column-gap-2 align-items-end">
            <span style="font-size: 1rem">{{ tryPlayStore.speaker.name }}</span>
            <span>{{ speed }}x</span>
          </div>
          <div class="d-flex flex-row column-gap-2 align-items-center">
            <ElIcon @click="handleStar" class="fs-6" :style="{ color: isStar ? 'red' : 'black' }">
              <StarFilled v-if="isStar"></StarFilled>
              <Star v-else></Star>
            </ElIcon>
            <span v-if="isSupper48K" class="badge text-bg-primary px-2"> 48K </span>
            <span v-else class="badge text-bg-primary px-2"> 24K </span>
            <span class="px-2"> {{ tryPlayStore.speaker.behavior }} </span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column align-items-end">
        <div class="text-info">音频时长，请以生成后的为准</div>
        <div class="d-flex">
          <div class="mt-1 d-flex flex-row align-items-center">
            <a-slider
              class="mt-1"
              style="
                width: 160px;
                border: 1px solid #fff;
                padding: 5px 15px;
                background-color: transparent;
                border-radius: 4px;
              "
              :max="timeMax"
              v-model="time"
              size="small"
              @input="handleTimeInput"
              @change="handleTimeChange"
              :format-tooltip="formatTime"
            ></a-slider>
            <div class="mt-1">
              <span class="ms-3">{{ timeText }}</span>
              <span> / </span>
              <span>{{ timeMaxText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签 -->
    <div style="padding: 0 5px" class="mt-3 role-list">
      <div
        class="d-flex flex-row flex-wrap justify-content-start align-items-center row-gap-2 column-gap-3"
      >
        <div v-for="(item, index) in domains" :key="index">
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 情绪 -->
    <!-- <EmotionList emotions="emotions"></EmotionList> -->
    <div
      class="mt-2 d-flex flex-row flex-wrap justify-content-start align-items-center row-gap-1 overflow-y-scroll scrollbar-none"
      style="max-height: 130px"
    >
      <div @click="handleStyleClick(0)" style="padding: 5px 3px">
        <StyleAvatar :activate="0 === selectedEmotion" :data="defaultStyleAvatar"></StyleAvatar>
      </div>
      <div
        @click="handleStyleClick(item.id)"
        v-for="(item, index) in emotions"
        :key="index"
        style="padding: 5px 3px"
      >
        <StyleAvatar :activate="item.id === selectedEmotion" :data="item"></StyleAvatar>
      </div>
    </div>

    <!-- 参数 -->
    <div
      class="d-flex border flex-wrap position-absolute"
      style="left: 10px; right: 10px; bottom: 120px"
    >
      <div class="w-50">
        <span style="width: 60px">语速：</span>
        <el-select style="width: calc(100% - 60px)" v-model="speed">
          <el-option
            v-for="(item, index) in speedList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="w-50">
        <span style="width: 60px">语调：</span>
        <el-select style="width: calc(100% - 60px)" v-model="pitch">
          <el-option
            v-for="(item, index) in pitchList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="w-50 d-flex align-items-center mt-2">
        <span style="width: 33px">音量：</span>
        <el-slider
          style="
            width: calc(100% - 94px);
            border: 1px solid #fff;
            padding: 0 15px;
            background-color: #fff;
            border-radius: 4px;
          "
          v-model="volume"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </div>
      <div class="w-50 mt-2">
        <span style="width: 60px">格式：</span>
        <el-select style="width: calc(100% - 60px)" v-model="pitch">
          <el-option
            v-for="(item, index) in pitchList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-box {
  height: 50px;
}
</style>

<script setup lang="ts">
import { ElSlider, ElIcon, ElMessage } from 'element-plus'
import PlayButton from './play-button.vue'
import { ref, onUnmounted, computed, watch, onMounted } from 'vue'
import { formatTime } from '@/utils'
import { Star, StarFilled } from '@element-plus/icons-vue'
import StyleAvatar from './style-avatar.vue'
import { useTryPlayStore } from '@/stores'
import { emitter } from '@/event-bus'
import type { Arrayable } from 'element-plus/lib/utils/typescript'
import { useDubbingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getSpeakerEmotionList } from '@/api/dict'

const speakerEmotionList = ref([])
const dubbingStore = useDubbingStore()
const tryPlayStore = useTryPlayStore()
const timeMax = tryPlayStore.audioPlayer.duration
const currentTime = tryPlayStore.audioPlayer.currentTime
const time = ref(0)
const isInput = ref(false)
const speed = ref(1)
const pitch = ref(0)
const volume = ref(1)
const timeMaxText = computed(() => formatTime(timeMax.value))
const timeText = computed(() => formatTime(time.value))
const isStar = ref(false)
const emotions = ref<any>([])
const domains = ref<any>([])
const { submitTtsData } = storeToRefs(dubbingStore)
const selectedEmotion = ref(0)
const speedList = ref<any>([])
const pitchList = ref<any>([])
const defaultStyleAvatar = ref({
  id: 0,
  name: '默认',
  imageUrl: '',
})
const isSupper48K = ref(false)

emitter.on('speaker:select', (speaker: any) => {
  const { emotionIdSet, domainIdSet } = speaker
  const { emotionList, domainList } = dubbingStore
  emotions.value = emotionList.filter((emotion: any) => emotionIdSet.includes(emotion.id))
  domains.value = domainList.filter((domain: any) => domainIdSet.includes(domain.id))
  // console.log("情绪",emotionIdSet,emotionList,emotions.value);
  // console.log("领域",domainIdSet,domainList,domains.value);
  defaultStyleAvatar.value.imageUrl = speaker.headerImage

  getSpeakerEmotionList(speaker.id).then((res: any) => {
    speakerEmotionList.value = res.rows
    let emotion = res.rows.find((em: any) => em.emotionId == 0)
    if (emotion) {
      isSupper48K.value = emotion.styleCallName.includes('48k')
    }
  })
})

onMounted(() => {
  emitter.on('tryplay-speaker-update-star', handleUpdateStarTheCache)

  speedList.value.push({ label: '0.5x', value: 0.5 })
  speedList.value.push({ label: '0.6x', value: 0.6 })
  speedList.value.push({ label: '0.8x', value: 0.8 })
  speedList.value.push({ label: '1.0x', value: 1.0 })
  speedList.value.push({ label: '1.2x', value: 1.2 })
  speedList.value.push({ label: '1.4x', value: 1.4 })
  speedList.value.push({ label: '1.6x', value: 1.6 })
  speedList.value.push({ label: '1.8x', value: 1.8 })
  speedList.value.push({ label: '2.0x', value: 2.0 })

  for (let i = -10; i <= 10; i++) {
    pitchList.value.push({ label: i, value: i })
  }
})

onUnmounted(() => {
  emitter.off('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

watch(
  volume,
  (value) => {
    // newValue.roles.length > 0 && handleRoleClick(newValue.roles[0].value)
    // newValue.styles.length > 0 && handleStyleClick(newValue.styles[0].value)
    submitTtsData.value.volume = value
  },
  { immediate: false },
)

watch(
  pitch,
  (value) => {
    submitTtsData.value.pitch = value
    // rootProsody.pitch = value.toString()
  },
  { immediate: false },
)

watch(
  speed,
  (value) => {
    submitTtsData.value.speed = value
    // rootProsody.rate = value.toString()
  },
  { immediate: false },
)

watch(currentTime, (newValue) => {
  if (!isInput.value) time.value = newValue
})

function handleStar() {
  // await tryPlayStore.star(editorKey, !isStar.value)
  ElMessage({
    message: 'Star',
  })
  isStar.value = !isStar.value
}

function handleUpdateStarTheCache(speakerId: string, isStar: boolean) {
  // const speakerCache = speakerList.value.find((v) => v.id === speakerId)
  // if (speakerCache) speakerCache.isStar = isStar
}

function handleStyleClick(value: number) {
  selectedEmotion.value = value
  // 注意此处不能使用全等
  let filters: any = speakerEmotionList.value.filter((emotion: any) => emotion.emotionId == value)
  // console.log(speakerEmotionList.value, value,filters);
  if (filters.length > 0) {
    let styleCallName = filters[0].styleCallName
    submitTtsData.value.speaker = styleCallName

    ElMessage({
      message: styleCallName,
    })
  }
}

function handleTimeInput() {
  isInput.value = true
}

function handleTimeChange(time: Arrayable<number>) {
  if (!(time instanceof Array)) {
    currentTime.value = time
    tryPlayStore.audioPlayer.play()
  }
  isInput.value = false
}
</script>
