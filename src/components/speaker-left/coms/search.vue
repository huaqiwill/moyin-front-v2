<template>
  <div class="d-flex mt-1" style="padding: 5px 10px">
    <a-input
      v-model="searchName"
      placeholder="共663款配音师，输入名称搜索"
      @input="handleInput"
    ></a-input>
    <el-button type="primary" class="ms-2" @click="handleRecent">最近</el-button>
    <el-button type="primary" class="ms-2" @click="handleCollect">收藏</el-button>
    <el-button type="primary" class="ms-2" @click="handleAll">全部</el-button>
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
  const { speakerListAllBackup, userCollectList } = dubbingStore
  speakerListAll.value = [...speakerListAllBackup]

  if (searchName.value !== '') {
    // 筛选出包含在CollectList的Speaker
    let collectSpeakerList = speakerListAll.value.filter((speaker: any) => {
      return userCollectList.find(
        (collect: any) =>
          speaker.id == collect.speakerId && collect.speakerNotes.includes(searchName.value),
      )
    })

    speakerListAll.value = speakerListAll.value.filter((speaker: any) => {
      return speaker.name.includes(searchName.value)
    })

    console.log(speakerListAll.value, collectSpeakerList)
    for (let i = 0; i < collectSpeakerList.length; i++) {
      let collectSpeaker: any = collectSpeakerList[i]
      if (speakerListAll.value.length === 0) {
        speakerListAll.value.push(collectSpeaker)
      } else {
        let result = speakerListAll.value.find((speaker: any) => speaker.id == collectSpeaker.id)
        if (!result) {
          speakerListAll.value.push(collectSpeaker)
        }
      }
    }
  }
  emitter.emit('speaker:loading:ok')
}

function handleRecent() {
  const { speakerListAllBackup } = dubbingStore
  speakerListAll.value = [...speakerListAllBackup]
  speakerListAll.value = speakerListAll.value.filter((speaker: any) => speaker.id == 1403)
  emitter.emit('speaker:loading:ok')
}

function handleCollect() {
  const { userCollectList, speakerListAllBackup } = dubbingStore

  speakerListAll.value = speakerListAllBackup.filter((speaker: any) => {
    return userCollectList.find((collect: any) => collect.speakerId == speaker.id) !== undefined
  })

  emitter.emit('speaker:loading:ok')
}

function handleAll() {
  const { speakerListAllBackup } = dubbingStore
  speakerListAll.value = [...speakerListAllBackup]
  emitter.emit('speaker:loading:ok')
}
</script>
