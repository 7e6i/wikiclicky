import { createApp } from 'vue'

import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'


import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import VoteView from '@/views/VoteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: HomeView},
    {path: '/vote', name: 'vote', component: VoteView},
    {path: '/about', name: 'about', component: AboutView},
  ],
})

const app = createApp(App)

app.use(router)

app.mount('#app')

