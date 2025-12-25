import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/stores/authStore.js";

import Auth from "@/views/Auth.vue";
import Home from "@/views/Home.vue";
import Help from "@/views/Help.vue";
import request from "@/views/Request.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import NotFound from '@/views/NotFound.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/requests',
      name: 'requests',
      component: Home,
      meta: {
        layout: 'main',
        auth: true
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        layout: 'main',
        auth: true
      }
    },
    {
      path: '/request/:id?',
      name: 'request',
      component: request,
      props: true,
      meta: {
        layout: 'main',
        auth: true
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: {
        layout: 'auth',
        auth: false
      }
    },
    {
      path: '/:notFound(.*)',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(''),
    },
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthRequired = to.meta.auth;

  if (!localStorage.getItem('token') && isAuthRequired) {
    next('/auth?message=auth')
  } else {
    next();
  }
})



export default router
