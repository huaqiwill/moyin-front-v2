<template>
  <div class="d-flex overflow-hidden" style="width: 100%; height: 100%">
    <Speaker />
    <EditorView :config="config" />
  </div>
</template>

<script setup lang="ts">
import { Speaker } from '@/components'
import { EditorView } from '@/views'
import config from '@/config/mock'
</script>

<style scoped lang="scss"></style>
