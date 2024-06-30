import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import WritePage from '@/components/WritePage.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Write',
    name: 'WritePage',
    component: WritePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
