<template>
  <app-page title="🔥 Вы успешно активировали почту! 🔥">
      <router-link to="/auth">Перейти к аутентификации</router-link>
  </app-page>
</template>

<script>
import AppPage from '@/components/ui/AppPage.vue'

export default {
  components: { AppPage },
}
</script>

<style lang="css" scoped></style>

