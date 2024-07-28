<template>
  <div
    class="d-flex align-items-center justify-content-between"
    style="padding: 10px; border-top: 1px solid #dee2e6"
  >
    <div>
      <span>0 / 6000</span>
      <el-tag v-if="dubbingStore.submitTtsData.speaker" class="ms-2">{{
        dubbingStore.submitTtsData.speaker
      }}</el-tag>
    </div>
    <div class="d-flex">
      <GenerateLogging2></GenerateLogging2>
      <a-button class="ms-2" type="primary" status="success" @click="handleDownload">
        <template #icon>
          <icon-to-bottom />
        </template>
        下载配音
      </a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, inject, ref } from 'vue'
import xmlFormat from 'xml-formatter'
import { serializeToSSML } from '@/serialize'
import { useEditorStore, useDubbingStore } from '@/stores'
import { IconToBottom } from '@arco-design/web-vue/es/icon'
import { GenerateLogging2 } from '@/components/dubbing-tools'

const dubbingStore = useDubbingStore()
const dialogVisible = ref(false)
const ssml = ref('')
const editorStore = useEditorStore()
const editorKey = inject<symbol>('editorKey')!
const generaterLoggingDialogShow = ref(false)
const ssmlFormat = computed(() => {
  return xmlFormat(ssml.value, {
    // 缩进
    indentation: '    ',
    // 过滤条件
    filter: (node: any) => node.type !== 'Comment',
    // 内容折叠
    collapseContent: false,
    // 行分隔符
    lineSeparator: '\n',
  })
})

function handleDownload() {
  let lastPlayUrl = dubbingStore.getLastPlayUrl()
  if (lastPlayUrl) {
    window.location.href = lastPlayUrl
  }
}

async function onCopySSML(isFormat: boolean) {
  console.log(ssml.value)

  await navigator.clipboard.writeText(isFormat ? ssmlFormat.value : ssml.value)
  dialogVisible.value = false
  ElMessage.success({ message: '复制成功!', grouping: true })
}

function onShowSSML() {
  ssml.value = serializeToSSML()
  dialogVisible.value = true
}

async function onSaveSSML() {
  const editor = editorStore.editor
  if (editor) {
    try {
      await editorStore.saveEditorHtml(editorKey, editor.getHtml, false)
      ElMessage.success({ message: '保存成功!', grouping: true })
    } catch (error) {
      ElMessage.error({ message: '保存失败!', grouping: true })
    }
  }
}

function onGeneraterLogging() {
  generaterLoggingDialogShow.value = true
}
</script>
