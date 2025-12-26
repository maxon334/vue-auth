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

(async () => {
  try {
    const res = await $app.get('/api/refresh', {withCredentials: true});

    useAuthStore().setAuthStatus(true);
    useAuthStore().createToken(res.data.accessToken);
    useAuthStore().setUser(res.data.user);
  } catch (e) { console.warn(e); router.push('/auth') }
})()

if (!localStorage.hasOwnProperty('requests')) {
  localStorage.setItem('requests', JSON.stringify([]))
}
///////////////////////!!!!!!!!!!!!!!!!!!!!!!!
