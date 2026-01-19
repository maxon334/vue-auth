import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {useAuthStore} from '@/stores/authStore.js'
import { $app } from '@/http/axios.js'
import App from './App.vue';
import router from './router';

import './theme.css';

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.mount('#app');

// Получение данных пользователя. Оставляем пользователя залогиненным, если есть валидный token в localStorage
(async () => {
  try {
    if (localStorage.getItem('token')) {
      // Получение данных пользователя после перезагрузки страницы
      const res = await $app.get('/api/refresh', {withCredentials: true});
      useAuthStore().setAuthStatus(true);
      useAuthStore().createToken(res.data.accessToken);
      useAuthStore().setUser(res.data.user);
      console.log(res.data.user)
      useAuthStore().setVerificationStatus(res.data.user.isActivated)
    }
  } catch (e) { console.warn(e);}
})()

