import { createApp } from 'vue'

import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { analytics } from '@/config/firebaseConfig.js'
import { logEvent } from 'firebase/analytics'

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

router.afterEach((to) => {
  // This will log a page_view event every time the route changes.
  logEvent(analytics, 'page_view', {
    page_path: to.path,
    page_title: to.name,
  })
})

const app = createApp(App)

app.use(router)

app.mount('#app')
