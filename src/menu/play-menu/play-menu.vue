<script setup lang="ts">
import { ElIcon } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import { BarButton } from "@/components";
import throttle from "lodash.throttle";
// import { getConfig } from "@/config";
// import { inject, ref } from "vue";
import { serializeToSSML } from "@/serialize";
import { useEditorStore, useTryPlayStore } from "@/stores";

const editorStore = useEditorStore();
const { editor } = storeToRefs(editorStore);

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const tryPlayStore = useTryPlayStore();
const { audioPlayer, play } = tryPlayStore;
const playState = audioPlayer.playState;
// const editorKey = inject<symbol>("editorKey")!;
// const ssmlEditorConfig = getConfig(editorKey);

// import { useDubbingStore } from "@/stores";
// import { storeToRefs } from "pinia";
import { tts } from "@/api/tts";
// const { ssmlRef } = storeToRefs(useDubbingStore());
// import { Base64 } from "js-base64";
import { storeToRefs } from "pinia";
import { useDubbingStore } from "@/stores";

const dubbingStore = useDubbingStore();

const { submitTtsData } = storeToRefs(dubbingStore);

import { emitter } from "@/event-bus";

emitter.on("tryplay-generator", () => {
  handleClick();
});

const handleClick = throttle(async () => {
  if (!editor.value) {
    return;
  }

  let text = serializeToSSML();
  let raw = editor.value.getText();

  submitTtsData.value.text = text;
  submitTtsData.value.rawText = raw;

  console.log("提交数据", submitTtsData.value);

  // tts(submitTtsData.value).then((res) => {
  //   console.log(res);
  //   dubbingStore.setLastPlayUrl(res.data);
  //   const audio = new Audio("/dev-api/moyin/tts/audition/" + res.data);
  //   audio.play();
  // });
  play();
  // await play(ssmlEditorConfig.tryPlay.play);
});
</script>

<template>
  <BarButton @click="handleClick" :disabled="disabled">
    <template #icon>
      <ElIcon v-if="tryPlayStore.isLoading" class="is-loading">
        <Loading></Loading>
      </ElIcon>
      <span
        v-else-if="playState === 'paused'"
        class="fs-3 iconfont-moyin moyin-icon_play"
      ></span>
      <span v-else class="iconfont icon-pause"></span>
    </template>
    播放
  </BarButton>
</template>

<style lang="scss" scoped></style>
