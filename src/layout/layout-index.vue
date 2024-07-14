<script setup lang="ts">
import { Header } from "./layout-header";
import { Footer } from "./layout-footer";
</script>

<template>
  <div class="common-layout">
    <Header />
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  height: 100vh;

  .header {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 85px;
  }

  .content {
    // padding: 4px 6px;
    display: flex;
    height: calc(100% - 140px);
  }

  .footer {
    width: 100%;
    height: 30px;
    max-height: 30px;
  }
}
</style>
