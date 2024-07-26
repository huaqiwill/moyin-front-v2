<template>
  <SpeakerLayout v-loading="loading">
    <template v-slot:content>
      <SpeakerSearch />
    </template>
    <template v-slot:sidebar>
      <SpeakerTagList />
    </template>
    <template v-slot:list>
      <SpeakerList :filter="filter" />
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
import { type FilterSpeaker } from '@/model'
import { defaultFilterSpeaker } from '@/model'

import { useDubbingStore } from '@/stores'
import { emitter } from '@/event-bus'

const dubbingStore = useDubbingStore()
const filter = ref<FilterSpeaker>(defaultFilterSpeaker())

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await dubbingStore.getSpeakerListAll()
  loading.value = false
  emitter.emit('speaker:loading:ok')
})
</script>
