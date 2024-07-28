<template>
  <div class="tag-list d-flex" style="width: 100%; height: 100%">
    <!-- language -->
    <div
      class="overflow-y-auto overflow-x-hidden scrollbar-none"
      style="padding: 10px 0; width: 80px"
    >
      <div class="item d-flex flex-column justify-content-center row-gap-2">
        <div class="text-center">
          <SimpleTag
            @click="handleLanguageClick(item.value)"
            v-for="(item, index) in languages"
            :key="index"
            :value="item.value"
            :activate="selectedLanguage === item.value"
          >
            {{ item.label }}
          </SimpleTag>
        </div>
      </div>
    </div>
    <!-- domains -->
    <div
      style="border-left: 1px solid #fff; padding: 10px 0; width: 80px"
      class="overflow-y-auto overflow-x-hidden scrollbar-none"
    >
      <div class="d-flex flex-column justify-content-center row-gap-2">
        <div class="text-center">
          <SimpleTag
            @click="handleDomainClick(item.value)"
            v-for="(item, index) in domains"
            :key="index"
            :value="item.value"
            :activate="selectedDomain === item.value"
          >
            {{ item.label }}
          </SimpleTag>
        </div>
      </div>
    </div>

    <div
      style="border-left: 1px solid #fff; padding: 10px 0; width: 80px"
      class="overflow-y-auto overflow-x-hidden scrollbar-none"
    >
      <div class="item d-flex flex-column justify-content-center row-gap-2">
        <div class="text-center">
          <SimpleTag
            @click="handleEmotionClick(item.value)"
            v-for="(item, index) in tags"
            :key="index"
            :value="item.value"
            :activate="selectedEmotion === item.value"
          >
            {{ item.label }}
          </SimpleTag>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag-list {
  margin-left: 5px;
  .list {
    padding: 10px 0;
    width: 80px;
  }
}
</style>

<script setup lang="ts">
// tag-list v1 item
import SimpleTag from './simple-tag.vue'
import { inject, onMounted, ref, shallowRef, toRaw } from 'vue'
import type { FilterSpeaker, LabelValue } from '@/model'
// import { getConfig } from "@/config";
import { useDubbingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { emitter } from '@/event-bus'

const emit = defineEmits<{ 'update:filter': [value: FilterSpeaker] }>()
// const props = defineProps<{ filter: FilterSpeaker }>();

// const editorKey = inject<symbol>("editorKey")!;
// const ssmlEditorConfig = getConfig(editorKey);
// const { topFlag, gender, featchTag } = ssmlEditorConfig.tryPlay;
const dubbingStore = useDubbingStore()

const tags = shallowRef<any>([])
const domains = shallowRef<any>([])
const languages = shallowRef<any>([])

const selectedLanguage = ref('')
const selectedDomain = ref('')
const selectedEmotion = ref('')

onMounted(async () => {
  // tags.value = await featchTag();
  await dubbingStore.getEmotionList()
  await dubbingStore.getDomainNameList()
  await dubbingStore.getLanguageNameList()

  const { emotionList, domainList, languageList } = dubbingStore

  tags.value = [
    {
      label: '全部情绪',
      value: '',
    },
    ...emotionList.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      }
    }),
  ]

  domains.value = [
    {
      label: '全部领域',
      value: '',
    },
    ...domainList.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      }
    }),
  ]

  languages.value = [
    {
      label: '全部语言',
      value: '',
    },
    ...languageList.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      }
    }),
  ]
  //
})

const { speakerListAll } = storeToRefs(dubbingStore)

function filterSpeaker() {
  const { speakerListAllBackup } = dubbingStore

  speakerListAll.value = [...speakerListAllBackup]

  if (selectedLanguage.value !== '') {
    speakerListAll.value = speakerListAll.value.filter((speaker: any) =>
      speaker.languageIdSet.includes(selectedLanguage.value),
    )
  }
  if (selectedEmotion.value !== '') {
    speakerListAll.value = speakerListAll.value.filter((speaker: any) =>
      speaker.emotionIdSet.includes(selectedEmotion.value),
    )
  }
  if (selectedDomain.value !== '') {
    speakerListAll.value = speakerListAll.value.filter((speaker: any) =>
      speaker.domainIdSet.includes(selectedDomain.value),
    )
  }

  emitter.emit('speaker:loading:ok')
  console.log('筛选后的数据', speakerListAll.value)
}

function handleLanguageClick(value: string) {
  // emit("update:filter", { ...toRaw(props.filter), language: value });

  // id
  selectedLanguage.value = value
  filterSpeaker()
}

function handleDomainClick(value: string) {
  // emit("update:filter", { ...toRaw(props.filter), domain: value });
  selectedDomain.value = value
  filterSpeaker()
}

// function handleTopFlagClick(value: string) {
//   emit("update:filter", { ...toRaw(props.filter), topFlag: value });
// }

// function handleGenderClick(value: string) {
//   emit("update:filter", { ...toRaw(props.filter), gender: value });
// }

function handleEmotionClick(value: string) {
  // emit("update:filter", { ...toRaw(props.filter), tag: value });
  selectedEmotion.value = value
  filterSpeaker()
}
</script>
