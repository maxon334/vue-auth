<template>
  <the-navbar />
  <the-sidebar v-if="useStore().showMessage"  />
  <div class="container with-nav">
    <router-view />
  </div>
</template>

<script setup>
import { useStore } from "@/stores/store.js";
import TheNavbar from '../components/TheNavbar.vue'
import TheSidebar from '../components/TheSidebar.vue'
</script>

<style scoped>

</style>
