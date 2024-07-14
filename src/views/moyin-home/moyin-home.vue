<template>
  <div style="width: 100%; height: 100%">
    <div class="dubbing">
      <DubbingList />

      <!-- <DubbingEditor /> -->
      <EditorView style="width: 100%" :config="config">
        <template v-slot:sidebar>
          <div style="padding: 0 5px; box-shadow: 3px 3px 3px #e7e7e7; margin-left: 3px">
            <GenerateLogging></GenerateLogging>
            <DubbingConfig></DubbingConfig>
            <FindSensitiveWords></FindSensitiveWords>
            <BatchCorrection></BatchCorrection>
            <SymbolMute></SymbolMute>
            <LocalVoiceChange></LocalVoiceChange>
            <Volume />
          </div>
        </template>
      </EditorView>

      <!-- <div style="width: 100px; padding: 0 5px">
      <a-button style="width: 100%">生成配音</a-button>
      <a-button style="width: 100%">下载配音</a-button>
      <a-button style="width: 100%">下载视频</a-button>
      <a-button style="width: 100%">下载字幕</a-button>
      <a-button style="width: 100%">生成记录</a-button>
      <a-button style="width: 100%">配音配置</a-button>
      <a-button style="width: 100%">多音字</a-button>
      <a-button style="width: 100%">解说模式</a-button>
      <a-button style="width: 100%">符号停顿</a-button>
      <a-button style="width: 100%">音量</a-button>
    </div> -->
    </div>
    <DubbingFooter></DubbingFooter>
  </div>
</template>

<script setup>
import { DubbingEditor, DubbingList, DubbingFooter } from "@/components";
import { EditorView } from "@/views";
import config from "@/config/mock";
import {
  GenerateLogging,
  DubbingConfig,
  FindSensitiveWords,
  BatchCorrection,
  SymbolMute,
  LocalVoiceChange,
  Volume,
} from "@/components/dubbing-tools";
</script>

<style scoped lang="scss">
.dubbing {
  height: 100%;
  width: 100%;
  display: flex;

  .dubbing-editor {
    width: 100%;
    height: 100%;
  }
}
</style>
