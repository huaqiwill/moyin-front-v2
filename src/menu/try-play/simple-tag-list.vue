<script setup lang="ts">
// tag-list v1 item
import SimpleTag from "./simple-tag.vue";
import { inject, onMounted, ref, toRaw } from "vue";
import type { FilterSpeaker, LabelValue } from "@/model";
import { getConfig } from "@/config";

const emit = defineEmits<{ "update:filter": [value: FilterSpeaker] }>();
const props = defineProps<{ filter: FilterSpeaker }>();

const editorKey = inject<symbol>("editorKey")!;
const ssmlEditorConfig = getConfig(editorKey);
const { topFlag, gender, featchTag } = ssmlEditorConfig.tryPlay;

import { useDubbingStore } from "@/stores";

const dubbingStore = useDubbingStore();

const tags = ref<LabelValue[]>([]);
const domains = ref<LabelValue[]>([]);
const languages = ref<LabelValue[]>([]);

onMounted(async () => {
  // tags.value = await featchTag();
  await dubbingStore.getEmotionList();
  await dubbingStore.getDomainNameList();
  await dubbingStore.getLanguageNameList();

  const { emotionList, domainList, languageList } = dubbingStore;

  tags.value = emotionList.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  domains.value = domainList.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  languages.value = languageList.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  //
});

function handleTopFlagClick(value: string) {
  emit("update:filter", { ...toRaw(props.filter), topFlag: value });
}

function handleGenderClick(value: string) {
  emit("update:filter", { ...toRaw(props.filter), gender: value });
}

function handleTagsClick(value: string) {
  emit("update:filter", { ...toRaw(props.filter), tag: value });
}
</script>

<template>
  <div class="tag-list w-100 mt-2">
    <div
      class="w-100 d-flex flex-row border-secondary align-items-center"
      style="height: 40px; border-bottom: 1px solid #3463ab"
    >
      <SimpleTag
        @click="handleGenderClick"
        v-for="(item, index) in gender"
        :key="index"
        :value="item.value"
        :activate="filter.gender === item.value"
      >
        {{ item.label }}
      </SimpleTag>
    </div>
    <div
      style="height: 60px; border-bottom: 1px solid #3463ab"
      class="w-100 pt-2 d-flex flex-row flex-wrap align-content-start row-gap-2 overflow-y-auto overflow-x-hidden scrollbar-none"
    >
      <SimpleTag
        @click="handleTagsClick"
        v-for="(item, index) in languages"
        :key="index"
        :value="item.value"
        :activate="filter.tag === item.value"
      >
        {{ item.label }}
      </SimpleTag>
    </div>
    <div
      style="height: 60px; border-bottom: 1px solid #3463ab"
      class="w-100 pt-2 d-flex flex-row flex-wrap align-content-start row-gap-2 overflow-y-auto overflow-x-hidden scrollbar-none"
    >
      <SimpleTag
        @click="handleTagsClick"
        v-for="(item, index) in domains"
        :key="index"
        :value="item.value"
        :activate="filter.tag === item.value"
      >
        {{ item.label }}
      </SimpleTag>
    </div>
    <div
      style="height: 60px"
      class="w-100 pt-2 d-flex flex-row flex-wrap align-content-start row-gap-2 overflow-y-auto overflow-x-hidden scrollbar-none"
    >
      <SimpleTag
        @click="handleTagsClick"
        v-for="(item, index) in tags"
        :key="index"
        :value="item.value"
        :activate="filter.tag === item.value"
      >
        {{ item.label }}
      </SimpleTag>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
