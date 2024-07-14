<script setup>


</script>

<template>
  <div class="dubbing-footer">
    <a-button style="width: 100%" type="outline" status="danger">生成配音</a-button>
    <a-button style="width: 100%" type="outline" status="danger">下载配音</a-button>
    <a-button style="width: 100%" type="outline" status="danger">下载视频</a-button>
    <a-button style="width: 100%" type="outline" status="danger">下载字幕</a-button>
    <a-button style="width: 100%" type="outline" status="danger">复制 SSML</a-button>
    <a-button style="width: 100%" type="outline" status="danger">显示 SSML</a-button>
    <a-button style="width: 100%" type="outline" status="danger">保存到浏览器</a-button>
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
