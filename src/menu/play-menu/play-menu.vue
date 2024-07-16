<script setup lang="ts">
import { useTryPlayStore } from "@/stores";
import { ElIcon } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import { BarButton } from "@/components";
import throttle from "lodash.throttle";
import { getConfig } from "@/config";
import { inject, ref } from "vue";
import { serializeToSSML } from "@/serialize";
import { useEditorStore } from "@/stores";

const editorStore = useEditorStore();
const { editor } = storeToRefs(editorStore);

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const tryPlayStore = useTryPlayStore();
const { audioPlayer, play } = tryPlayStore;
const playState = audioPlayer.playState;
const editorKey = inject<symbol>("editorKey")!;
const ssmlEditorConfig = getConfig(editorKey);

// import { useDubbingStore } from "@/stores";
// import { storeToRefs } from "pinia";
import { tts } from "@/api/tts";
// const { ssmlRef } = storeToRefs(useDubbingStore());
import { Base64 } from "js-base64";
import { storeToRefs } from "pinia";

const handleClick = throttle(async () => {
  // console.log(ssmlRef.value);
  if (!editor.value) {
    return;
  }
  let text = serializeToSSML();

  // console.log(editor.getText());

  // console.log(text2);
  let raw = editor.value.getText();

  console.log(Base64.encode(text));

  console.log(text);
  let data = {
    text: text,
    speaker: "",
    audioType: "mp3",
    rawText: raw,
    speed: 1,
    convert: "",
    rate: 0,
    volume: 0,
    pitch: 0,
    symbolSil: "",
    ignoreLimit: true,
    genSrt: true,
    mergeSymbol: true,
  };

  tts(data).then((res) => {
    console.log(res);
    const audio = new Audio("/dev-api/moyin/tts/audition/" + res.data);
    audio.play();
  });
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
