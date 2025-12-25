import {defineStore} from "pinia";
import {ref, isRef, isReactive} from "vue";
import axios from "axios";
import { $app } from '@/http/axios.js'
import router from "@/router/index.js";
import {errorHandling} from "@/utils/errorHandling.js";

export const useAuthStore = defineStore('auth', () => {
  let token = null;
  let error = ref(null);

  function createToken(value) {
    token = value;
    localStorage.setItem('token', token)
  }

  function resetToken() {
    token = null;
    localStorage.removeItem('token');
  }

  function clearError() {
    error.value = null
  }

  function logout() {
    resetToken()
  }

  async function sendUser(url, payload) {
    try {
      const res = await axios.post(url, {
        email: payload.email.value,
        password: payload.password.value,
        returnSecureToken: true
      });
      console.log(res);
      createToken(res.data.idToken);
      await router.push('/requests');
    } catch(e) {
      console.log(e.response.data.error.message)
      if (e.response.data.error.message === "EMAIL_EXISTS") {
        return await signIn(payload)
      }
      error.value = errorHandling(e.response.data.error.message);
    }
  }


  async function signIn({email, password}) {
    const res = await $app.post('/api/login', {email, password});
    console.log(res);
    return res
  }

  async function signUp({ email, password }) {
    const res = await $app.post('/api/registration', {email, password});
    console.log(res);

    // if (res.success) {
    //   // Сохраняем токен
    //   localStorage.setItem('token', res.token);
    //   console.log('Регистрация успешна!', res.user);
    // } else {
    //   console.error('Ошибка:', res.message);
    // }

    return res;
  }

  return {
    logout, signIn, signUp,
    createToken, resetToken, token,
    error, clearError
  }
})
