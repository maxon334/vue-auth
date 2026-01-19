<template>
  <div class="loader" :class="type"></div>
</template>

<script setup>
defineProps({
  type: String
})
</script>

<style scoped>
.primary:after {
  background-color: #42b983;
}

.small {
  font-size: 10px;
  margin: 0;
  width: 2em;
  height: 2em;
}

</style>
