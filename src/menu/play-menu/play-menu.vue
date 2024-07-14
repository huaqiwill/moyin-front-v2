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

const handleClick = throttle(async () => {
  console.log("开始播放");
  // console.log(ssmlRef.value);
  let text2 = serializeToSSML();

  let { editor } = useEditorStore();
  if (!editor) {
    return;
  }

  // console.log(editor.getText());

  // console.log(text2);
  // text2 = editor.getText();
  const text = text2;

  console.log(text);

  tts(text).then((res) => {
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
