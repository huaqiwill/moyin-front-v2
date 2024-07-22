<template>
  <div class="home">
    <DubbingList />
    <EditorView style="width: 100%" :config="config">
      <!-- <template v-slot:sidebar>
        <div
          style="
            padding: 0 5px;
            margin-left: 3px;
            margin-right: 3px;
            background-color: #f4f6f7;
            border-radius: 3px;
          "
        >
          <GenerateLogging></GenerateLogging>
          <DubbingConfig></DubbingConfig>
          <FindSensitiveWords></FindSensitiveWords>
          <BatchCorrection></BatchCorrection>
          <SymbolMute></SymbolMute>
          <LocalVoiceChange></LocalVoiceChange>
          <Volume />
        </div>
      </template> -->
    </EditorView>
  </div>
</template>

<script setup>
import { DubbingEditor, DubbingList } from "@/components";
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
.home {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
</style>
