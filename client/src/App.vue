<template>
  <main-layout v-if="authStore.token" />
  <auth-layout v-else />
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import MainLayout from "@/layout/MainLayout.vue";
import AuthLayout from "@/layout/AuthLayout.vue";

const authStore = useAuthStore();
</script>
