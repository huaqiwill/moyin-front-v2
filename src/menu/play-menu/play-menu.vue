<script setup lang="ts">
// 播放 v2
import { ElIcon } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { BarButton } from '@/components'
import throttle from 'lodash.throttle'
import { serializeToSSML } from '@/serialize'
import { useEditorStore, useTryPlayStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useDubbingStore } from '@/stores'
import { emitter } from '@/event-bus'
import { onMounted } from 'vue'

const editorStore = useEditorStore()
const { editor } = storeToRefs(editorStore)
const tryPlayStore = useTryPlayStore()
const { audioPlayer, play } = tryPlayStore
const playState = audioPlayer.playState
const dubbingStore = useDubbingStore()
const { submitTtsData } = storeToRefs(dubbingStore)

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

onMounted(() => {
  emitter.on('tryplay-generator', () => {
    handleClick()
  })
})

const handleClick = throttle(async () => {
  if (!editor.value) {
    return
  }

  let text = serializeToSSML()
  let raw = editor.value.getText()

  submitTtsData.value.text = text
  submitTtsData.value.rawText = raw

  // dubbingStore.tempUseSpeakerList.push(speaker)

  play()
})
</script>

<template>
  <BarButton @click="handleClick" :disabled="disabled">
    <template #icon>
      <ElIcon v-if="tryPlayStore.isLoading" class="is-loading">
        <Loading></Loading>
      </ElIcon>
      <span v-else-if="playState === 'paused'" class="fs-3 iconfont-moyin moyin-icon_play"></span>
      <span v-else class="iconfont icon-pause"></span>
    </template>
    播放
  </BarButton>
</template>

<style lang="scss" scoped></style>
