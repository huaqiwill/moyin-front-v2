<template>
  <SpeakerLayout v-loading="loading">
    <template v-slot:content>
      <SpeakerSearch />
    </template>
    <template v-slot:sidebar>
      <SpeakerTagList />
    </template>
    <template v-slot:list>
      <SpeakerList />
    </template>
    <template v-slot:detail>
      <SpeakerDetail />
    </template>
  </SpeakerLayout>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { SpeakerLayout } from '.'
import { SpeakerTagList, SpeakerList, SpeakerDetail, SpeakerSearch } from './coms'

import { useDubbingStore } from '@/stores'
import { emitter } from '@/event-bus'

const dubbingStore = useDubbingStore()

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await dubbingStore.getSpeakerListAll()
  await dubbingStore.getStarList()
  loading.value = false
  emitter.emit('speaker:loading:ok')

  // 当数据加载成功后，默认选择第一个
  const { speakerListAll } = dubbingStore
  if (speakerListAll.length > 0) {
    emitter.emit('speaker:select', speakerListAll[0])
  }
})
</script>
