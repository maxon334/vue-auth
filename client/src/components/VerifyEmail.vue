<template>
  <app-page>
    <div class='alert warning' style="display: flex; justify-content: space-between">
      <p class="alert-title" style="line-height: 17px">Подтвердите почту</p>
      <button class="btn warning" type="button" :disabled="disabled" @click="submit">{{!timer ? 'Отправить письмо' : ('0:' + (timer < 10 ? '0' + timer : timer))}}</button>
    </div>
  </app-page>
</template>

<script setup>
import {ref} from 'vue';
import AppPage from '@/components/ui/AppPage.vue'
import { $app } from '@/http/axios.js';
import { useAuthStore } from '@/stores/authStore.js'

let disabled = ref(false);
let timer = ref(false);
const URL = 'http://localhost:5000' // !!!
async function submit() {
  await $app.post('/api/mail', {to: useAuthStore().user.email, link: URL + '/api/activate/' + useAuthStore().user.activationLink})
  const time = (Date.now() / 1000) + 5
  const interval = setInterval(() => {
    disabled.value = true
    timer.value = Math.ceil(time - Date.now() / 1000);
    if (timer.value === 0) {
      clearInterval(interval);
      timer.value = false;
      disabled.value = false
    }
  }, 1000);
}
</script>

<style lang="scss" scoped></style>
