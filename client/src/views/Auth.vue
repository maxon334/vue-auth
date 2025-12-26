<template>
  <form class="card"
        style="max-width: 800px; margin: 0 auto"
        autocomplete="off" @submit.prevent>
    <h1>Войти в систему</h1>
    <div class="form-control" :class="[{'error': emailErr}]">
      <label for="email">Email</label>
      <input v-model="email" type="text" id="email">
      <small v-if="emailErr">{{ emailErr }}</small>
    </div>
    <div class="form-control" :class="[{'error': passwordErr}]">
      <label for="password">Пароль</label>
      <input v-model="password" type="password" id="password">
      <small v-if="passwordErr">{{ passwordErr }}</small>
    </div>
    <button class="btn primary" type="submit" @click="login" :disabled="store.isLoading">
      {{!store.isLoading ? 'Войти' : ''}}
      <app-loader v-if="store.isLoading" />
    </button>
    <small style="color: red">{{authStore.error}}</small>

    <button class="btn primary" type="submit" @click="registration" :disabled="store.isLoading">
      {{!store.isLoading ? 'Регистрация' : ''}}
      <app-loader v-if="store.isLoading" />
    </button>
  </form>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
import { useStore } from '@/stores/store.js'
import {ref, watch} from "vue";
import {useRoute} from "vue-router";

import emailValidator from 'email-validator';
import {useAlertStore} from "@/stores/alertStore.js";
import AppLoader from '@/components/ui/AppLoader.vue'

export default {
  components: { AppLoader },
setup() {
  const authStore = useAuthStore();
  const alertStore = useAlertStore();
  const store = useStore();
  const email = ref('smaxims03@mail.ru');
  const password = ref('123456789');
  let emailErr = ref(null);
  let passwordErr = ref(null);

  watch(email, () => { emailErr.value = null; authStore.clearError(); });
  watch(password, () => { passwordErr.value = null; authStore.clearError(); });

  if (useRoute().query.message) {
    alertStore.changeAlert(true, 'danger', 'Войдите в систему, чтобы получить доступ!');
  }

  function isValid() {
    if (!emailValidator.validate(email.value)) {
      emailErr.value = 'Неверный email'
    }
    if (password.value.length < 8) {
      passwordErr.value = 'Длина пароля должна быть больше 8'
    }
    if (email.value === '') {
      emailErr.value = 'Поле не может быть пустым'
    }
    if (password.value === '') {
      passwordErr.value = 'Поле не может быть пустым'
    }
    if (emailValidator.validate(email.value) && password.value.length >= 8) {
      return true
    } else {
      return false
    }
  }

  function login() {
    if (isValid()) {
      authStore.login({email: email.value, password: password.value});
    }
  }

  function registration() {
    if (isValid()) {
      authStore.registration({email: email.value, password: password.value});
    }
  }


  return {
    email, emailErr,
    password, passwordErr,
    login, registration,
    authStore, store
  }
}
}
</script>

<style scoped>
.error input {
  border: 1px solid #e53935;
}

.error small {
  color: #e53935;
}
</style>
