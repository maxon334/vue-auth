import { createRouter, createWebHistory } from 'vue-router'

import Auth from "@/views/Auth.vue";
import Home from "@/views/Home.vue";
import Help from "@/views/Help.vue";
import request from "@/views/Request.vue";
import NotFound from '@/views/NotFound.vue'
import EmailActivated from '@/views/EmailActivated.vue'
import DragAndDrop from '@/views/DragAndDrop.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/requests',
      name: 'requests',
      component: () => import('@/views/Home.vue'),
      meta: {
        layout: 'main',
        auth: true
      }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/Help.vue'),
      meta: {
        layout: 'main',
        auth: true
      }
    },
    {
      path: '/request/:id?',
      name: 'request',
      component: () => import('@/views/Request.vue'),
      props: true,
      meta: {
        layout: 'main',
        auth: true
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
      meta: {
        layout: 'auth',
        auth: false
      }
    },
    {
      path: '/:notFound(.*)',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/email-activation',
      name: 'email-activation',
      component: () => import('@/views/EmailActivated.vue'),
    },
    {
      path: '/drag-n-drop',
      name: 'drag-n-drop',
      component: () => import('@/views/DragAndDrop.vue'),
    },
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  const isAuthRequired = to.meta.auth;

  if (!localStorage.getItem('token') && isAuthRequired) {
    next('/auth?message=auth')
  } else {
    next();
  }
})

export default router
