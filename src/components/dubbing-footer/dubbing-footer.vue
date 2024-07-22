<script setup lang="ts">
import { ElMessage } from "element-plus";

import { computed, inject, ref } from "vue";
import xmlFormat from "xml-formatter";
import { serializeToSSML } from "@/serialize";
import { useEditorStore } from "@/stores";
import { downloadAudio, downloadSrt, downloadVideo } from "@/api/tts";
import {
  IconDelete,
  IconToBottom,
  IconEye,
  IconUpload,
} from "@arco-design/web-vue/es/icon";
import { GenerateLogging2 } from "@/components/dubbing-tools";

const dialogVisible = ref(false);
const ssml = ref("");
const editorStore = useEditorStore();
const editorKey = inject<symbol>("editorKey")!;
// const { ssmlRef, ssmlFormatRef } = storeToRefs(useDubbingStore());

/**
 * SSML格式化
 */
const ssmlFormat = computed(() => {
  console.log(ssml.value);

  return xmlFormat(ssml.value, {
    // 缩进
    indentation: "    ",
    // 过滤条件
    filter: (node: any) => node.type !== "Comment",
    // 内容折叠
    collapseContent: false,
    // 行分隔符
    lineSeparator: "\n",
  });
});

/**
 * 生成配音
 */
const onGenerater = () => {
  ElMessage({
    message: "生成配音",
  });
};

/**
 * 下载配音
 */
const onDownload = () => {
  ElMessage({
    message: "下载配音",
  });
  let url = "";
  downloadAudio(url).then((res) => {
    console.log(res);
  });
};

/**
 * 下载视频
 */
const onDownloadVedio = () => {
  ElMessage({
    message: "下载视频",
  });
  let url = "";
  downloadVideo(url).then((res) => {
    console.log(res);
  });
};

/**
 * 下载字幕
 */
const onDownloadSrt = () => {
  ElMessage({
    message: "下载字幕",
  });
  let url = "";
  downloadSrt(url).then((res) => {
    console.log(res);
  });
};

/**
 *
 * @param isFormat 复制SSML
 */
const onCopySSML = async (isFormat: boolean) => {
  console.log(ssml.value);

  await navigator.clipboard.writeText(isFormat ? ssmlFormat.value : ssml.value);
  dialogVisible.value = false;
  ElMessage.success({ message: "复制成功!", grouping: true });
};

/**
 * 显示SSML
 */
const onShowSSML = () => {
  ssml.value = serializeToSSML();
  dialogVisible.value = true;
};

/**
 * 保存SSML
 */
const onSaveSSML = async () => {
  const editor = editorStore.editor;
  if (editor) {
    try {
      await editorStore.saveEditorHtml(editorKey, editor.getHtml, false);
      ElMessage.success({ message: "保存成功!", grouping: true });
    } catch (error) {
      ElMessage.error({ message: "保存失败!", grouping: true });
    }
  }
};

const generaterLoggingDialogShow = ref(false);
function onGeneraterLogging() {
  generaterLoggingDialogShow.value = true;
}
</script>

<template>
  <div class="dubbing-footer">
    <GenerateLogging2 v-model="generaterLoggingDialogShow"></GenerateLogging2>
    <a-button type="primary" status="danger" @click="onGeneraterLogging">
      <template #icon>
        <icon-upload />
      </template>
      生成记录
    </a-button>

    <el-dropdown>
      <a-button style="width: 100%" type="primary" status="normal" @click="onGenerater">
        <template #icon>
          <icon-upload />
        </template>
        生成配音
      </a-button>
      <template #dropdown>
        <div class="p-3 d-flex flex-column" style="width: 100px">
          <a-button type="primary" status="normal" @click="onGenerater">
            <template #icon>
              <icon-delete />
            </template>
            生成 MP3
          </a-button>
          <a-button type="primary" status="normal" @click="onGenerater" class="mt-2">
            <template #icon>
              <icon-delete />
            </template>
            生成 WAV
          </a-button>
        </div>
      </template>
    </el-dropdown>

    <!-- <el-dropdown>
      
      <template #dropdown>
        <div class="p-3 d-flex flex-column">
          <a-button type="primary" status="warning" @click="onDownloadVedio">
            <template #icon>
              <icon-delete />
            </template>
            下载音频
          </a-button>
          <a-button class="mt-2" type="primary" status="danger" @click="onDownloadVedio">
            <template #icon>
              <icon-delete />
            </template>
            下载视频
          </a-button>
          <a-button class="mt-2" type="primary" status="danger" @click="onDownloadSrt">
            <template #icon>
              <icon-delete />
            </template>
            下载字幕
          </a-button>
        </div>
      </template>
    </el-dropdown> -->
    <a-button type="primary" status="success" @click="onDownload">
      <template #icon>
        <icon-to-bottom />
      </template>
      下载配音
    </a-button>

    <el-dropdown>
      <a-button style="width: 100%" type="primary" status="warning" @click="onDownload">
        <template #icon>
          <icon-eye />
        </template>
        查看 SSML
      </a-button>
      <template #dropdown>
        <div class="p-3 d-flex flex-column">
          <a-button type="primary" status="warning" @click="onCopySSML(false)">
            复制 SSML
          </a-button>
          <a-button type="primary" status="warning" @click="onShowSSML" class="mt-2">
            显示 SSML
          </a-button>
          <a-button type="primary" status="warning" @click="onSaveSSML" class="mt-2">
            保存到浏览器
          </a-button>
        </div>
      </template>
    </el-dropdown>

    <el-dialog v-model="dialogVisible" title="查看SSML" width="80%">
      <div
        class="border border-secondary-subtle rounded-2 scrollbar overflow-y-auto"
        style="white-space: pre-wrap; max-height: 50vh"
      >
        <highlightjs language="xml" :code="ssmlFormat" />
      </div>
      <template #header>
        <span style="font-size: 18px">预览SSML</span>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <ElButton type="info" @click="onCopySSML(true)">复制+关闭</ElButton>
          <ElButton type="primary" @click="onCopySSML(false)"
            >压缩+复制+关闭(推荐)</ElButton
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.dubbing-footer {
  height: 100%;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: end;
}
</style>
