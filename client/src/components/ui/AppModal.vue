<template>
  <div class="modal-backdrop" @click="$emit('close')"></div>
  <div class="modal">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<script>
import { useStore } from "@/stores/store.js";

export default {
  setup() {
    return {
      useStore
    }
  },
  props: ['title'],
  emits: ['close']
}
</script>

<style scoped>

</style>
