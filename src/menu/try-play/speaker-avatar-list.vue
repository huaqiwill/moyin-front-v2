<script setup lang="ts">
// 头像列表部分

import {
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  toRaw,
  watch,
} from "vue";
import SpeakerAvatar from "./speaker-avatar.vue";
import type { FilterSpeaker, Speaker } from "@/model";
import { useTryPlayStore } from "@/stores";
// import { getConfig } from "@/config";
import type { SpeakerAvatarData } from "./data";
import { emitter } from "@/event-bus";

import { useDubbingStore } from "@/stores";
import { getSpeakerListApi } from "@/api/tts";

const dubbingStore = useDubbingStore();

const props = defineProps<{ filter: FilterSpeaker }>();

const editorKey = inject<symbol>("editorKey")!;
// const ssmlEditorConfig = getConfig(editorKey);
// const { fetchData } = ssmlEditorConfig.tryPlay;
const tryPlayStore = useTryPlayStore();

const speakerAvatarList = ref<SpeakerAvatarData[]>([]);
const speakerList = shallowRef([]);

watch(
  () => props.filter,
  async () => {
    await handleFetchData();
  }
);

function handleClick(value: string) {
  const speaker = speakerList.value.find((v: any) => v.name === value);
  speaker && tryPlayStore.setSpeaker(editorKey, speaker);
}

function handleUpdateStarTheCache(speakerId: string, isStar: boolean) {
  const item: any = speakerList.value.find((v: any) => v.id === speakerId);
  if (item) {
    item.isStar = isStar;
  }
}

const queryParams = reactive({
  pageSize: 50,
  pageNum: 1,
});

const total = ref(0);

onMounted(async () => {
  emitter.on("tryplay-speaker-update-star", handleUpdateStarTheCache);

  await dubbingStore.getSpeakerList(queryParams);
  const { speakerList, speakerTotal } = dubbingStore;
  total.value = speakerTotal;
  // speakerList.value = speakerListAll;
  // await dubbingStore.getSpeakerList();

  // await handleFetchData();

  speakerAvatarList.value = speakerList.map((v: any) => ({
    label: v.name,
    value: v.id,
    avatar: v.headerImage,
    isFree: true,
  }));

  // if (speakerAvatarList.value.length > 0) handleClick(speakerAvatarList.value[0].value);
});

onUnmounted(() => {
  emitter.off("tryplay-speaker-update-star", handleUpdateStarTheCache);
});

async function handleFetchData() {
  // try {
  //   console.log("属性1：", props.filter);

  //   speaderCache.value = await fetchData({ ...toRaw(props.filter) });

  //   console.log("属性2：", speaderCache.value);

  //   // getSpeakerList().then(res=>{

  //   // })
  // } catch (error) {
  //   emitter.emit("error", error);
  // }

  getSpeakerListApi({}).then((res: any) => {
    // speakerList.value = res.rows;
    // console.log("获取配音员列表：", res.rows);
    console.log(res.rows);
    speakerAvatarList.value = res.rows.map((v: any) => ({
      label: v.name,
      value: v.id,
      avatar: v.headerImage,
      isFree: true,
    }));
  });
}
</script>

<template>
  <div
    style="height: 280px"
    class="w-100 d-flex flex-row flex-wrap justify-content-start overflow-x-hidden overflow-y-auto scrollbar-none"
  >
    <div style="margin: 8px 11px" v-for="(item, index) in speakerAvatarList" :key="index">
      <SpeakerAvatar
        :data="item"
        :activate="item.value === tryPlayStore.speaker.name"
        @click="handleClick(item.value)"
      ></SpeakerAvatar>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
