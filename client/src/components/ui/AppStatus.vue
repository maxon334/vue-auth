<template>
  <span class='badge' :class="styles">{{ text }}</span>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  type: {
    type: String,
    validate(value) {
      return ['active', 'done', 'canceled', 'inProgress'].includes(value)
    }
  }
})
const textMap = {
  active: 'Активен',
  done: 'Завершен',
  canceled: 'Отменен',
  inProgress: 'Выполняется'
};
const stylesMap = {
  active: 'primary',
  done: 'primary',
  canceled: 'danger',
  inProgress: 'warning'
};
const text = ref(textMap[props.type]);
const styles = ref(stylesMap[props.type]);
</script>

<style scoped></style>
