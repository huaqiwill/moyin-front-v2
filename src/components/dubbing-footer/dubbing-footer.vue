<script setup lang="ts">
import { ElMessage } from "element-plus";

import { computed, inject, ref } from "vue";
import xmlFormat from "xml-formatter";
import { serializeToSSML } from "@/serialize";
import { useEditorStore } from "@/stores";

const dialogVisible = ref(false);
const ssml = ref("");
const editorStore = useEditorStore();
const editorKey = inject<symbol>("editorKey")!;
// const { ssmlRef, ssmlFormatRef } = storeToRefs(useDubbingStore());

const ssmlFormat = computed(() => {
  return xmlFormat(ssml.value, {
    indentation: "    ",
    filter: (node: any) => node.type !== "Comment",
    collapseContent: true,
    lineSeparator: "\n",
  });
});

const onGenerater = () => {
  ElMessage({
    message: "生成配音",
  });
};

const onDownload = () => {
  ElMessage({
    message: "下载配音",
  });
};

const onDownloadVedio = () => {
  ElMessage({
    message: "下载视频",
  });
};

const onDownloadSrt = () => {
  ElMessage({
    message: "下载字幕",
  });
};

const onCopySSML = async (isFormat: boolean) => {
  console.log(ssml.value);

  await navigator.clipboard.writeText(isFormat ? ssmlFormat.value : ssml.value);
  dialogVisible.value = false;
  ElMessage.success({ message: "复制成功!", grouping: true });
};

const onShowSSML = () => {
  ssml.value = serializeToSSML();
  dialogVisible.value = true;
};

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
</script>

<template>
  <div class="dubbing-footer">
    <a-button style="width: 100%" type="outline" status="danger" @click="onGenerater">
      生成配音
    </a-button>
    <a-button style="width: 100%" type="outline" status="danger" @click="onDownload">
      下载配音
    </a-button>
    <a-button style="width: 100%" type="outline" status="danger" @click="onDownloadVedio">
      下载视频
    </a-button>
    <a-button style="width: 100%" type="outline" status="danger" @click="onDownloadSrt"
      >下载字幕
    </a-button>
    <a-button
      style="width: 100%"
      type="outline"
      status="danger"
      @click="onCopySSML(false)"
    >
      复制 SSML
    </a-button>
    <a-button style="width: 100%" type="outline" status="danger" @click="onShowSSML"
      >显示 SSML
    </a-button>
    <a-button style="width: 100%" type="outline" status="danger" @click="onSaveSSML"
      >保存到浏览器
    </a-button>
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
  justify-content: start;
}
</style>
