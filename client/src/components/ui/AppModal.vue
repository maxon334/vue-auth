<template>
  <div class="modal-backdrop" @click="$emit('close')"></div>
  <div class="modal">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup>

defineEmits(['close'])
defineProps({
  title: String
})
</script>

<style scoped>

</style>
