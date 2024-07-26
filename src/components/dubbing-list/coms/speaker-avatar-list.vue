<template>
  <div
    style="height: 100%; width: 100%; border-left: 1px solid #fff"
    class="overflow-x-hidden overflow-y-auto scrollbar-custom"
  >
    <div class="d-flex flex-row flex-wrap justify-content-start">
      <div
        style="margin: 8px 0; flex: 0 0 68px; height: 68px"
        v-for="(item, index) in speakerList"
        :key="index"
      >
        <SpeakerAvatar
          :data="item"
          :activate="item.id === tryPlayStore.speaker.id"
          @click="handleClick(item)"
        ></SpeakerAvatar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import SpeakerAvatar from './speaker-avatar.vue'
import { useTryPlayStore } from '@/stores'
import { emitter } from '@/event-bus'
import { useDubbingStore } from '@/stores'

const dubbingStore = useDubbingStore()
const tryPlayStore = useTryPlayStore()
const speakerList = ref<any>([])

emitter.on('speaker:loading:ok', () => {
  const { speakerListAll } = dubbingStore
  speakerList.value = speakerListAll
})

onMounted(async () => {
  emitter.on('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

onUnmounted(() => {
  emitter.off('tryplay-speaker-update-star', handleUpdateStarTheCache)
})

function handleClick(speaker: any) {
  tryPlayStore.setSpeakerForce(speaker)
  emitter.emit('speaker:select', speaker)
}

function handleUpdateStarTheCache(speakerId: string, isStar: boolean) {
  const item: any = speakerList.value.find((v: any) => v.id === speakerId)
  if (item) {
    item.isStar = isStar
  }
}
</script>
