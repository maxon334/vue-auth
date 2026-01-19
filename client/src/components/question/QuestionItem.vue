<template>
  <the-navbar />
  <div class="question" @click="isOpen = !isOpen">
    <div class="question-title">{{ question.title }}</div>
    <div class="question-body" v-if="isOpen">{{ question.text }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TheNavbar from "@/components/TheNavbar.vue";

defineProps({
  question: Object
})
const isOpen = ref(false);

</script>

<style scoped></style>
