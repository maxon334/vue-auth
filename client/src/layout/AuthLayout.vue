<template>
  <div class="container">
    <teleport to="body">
      <app-message v-if="useAlertStore().alert.show" :type="useAlertStore().alert.type" :text="useAlertStore().alert.text" />
    </teleport>
    <router-view />
  </div>
</template>

<script setup>
import {useAlertStore} from "@/stores/alertStore.js";
import AppMessage from '../components/ui/AppMessage.vue'
</script>

<style scoped>

</style>
