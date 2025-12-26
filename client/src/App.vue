<template>
  <main-layout v-if="authStore.token" />
  <auth-layout v-else />
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
import MainLayout from "@/layout/MainLayout.vue";
import AuthLayout from "@/layout/AuthLayout.vue";

export default {
  setup() {
    const authStore = useAuthStore();
    return {
      authStore, localStorage
    }
  },
  components: {AuthLayout, MainLayout}

}
</script>
