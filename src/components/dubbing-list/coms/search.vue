<template>
  <div class="d-flex mt-1" style="padding: 5px 10px">
    <a-input
      v-model="searchName"
      placeholder="共663款配音师，输入名称搜索"
      @input="handleInput"
    ></a-input>
    <el-button type="primary" class="ms-2" @click="handleRecent">最近</el-button>
    <el-button type="primary" class="ms-2" @click="handleCollect">收藏</el-button>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .arco-input-wrapper {
  background-color: #fff;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useDubbingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { emitter } from '@/event-bus'

const dubbingStore = useDubbingStore()
const searchName = ref('')

const { speakerListAll } = storeToRefs(dubbingStore)

function handleInput() {
  const { speakerListAllBackup } = dubbingStore
  speakerListAll.value = [...speakerListAllBackup]
  if (searchName.value !== '') {
    speakerListAll.value = speakerListAll.value.filter((speaker: any) =>
      speaker.name.includes(searchName.value),
    )
  }
  emitter.emit('speaker:loading:ok')
}

function handleRecent() {}

function handleCollect() {}
</script>
