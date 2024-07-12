<script setup lang="ts"></script>

<template>
  <div class="bar-wrapper d-flex flex-row justify-content-center align-items-center">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bar-wrapper {
  padding: 10px 0;
}
</style>
