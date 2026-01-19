<template>
  <div class="card" style="position: relative; margin-top: 30px; max-width: 1100px;">
    <h1 class="card-title">
      {{ title }}
      <slot name="header" />
    </h1>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<style scoped></style>
