import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import WritePage from '@/components/WritePage.vue';
import NotionPages from '@/components/NotionPages.vue';
import Chat from '@/components/Chat.vue';
import Map from '@/components/Map.vue';
import NaverLogin from '@/components/NaverLogin.vue';
import NaverLoginEnter from '@/components/NaverLoginEnter.vue';
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
  },
  {
    path: '/NotionPages',
    name: 'NotionPages',
    component: NotionPages
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/Map',
    name: 'Map',
    component: Map
  },
  {
    path: '/Naverlogin',
    name: 'Naverlogin',
    component: NaverLogin
  },
  {
    path: '/NaverloginEnter',
    name: 'NaverloginEnter',
    component: NaverLoginEnter
  }
];

const router = createRouter({
  history: createWebHistory(), // 히스토리 모드 사용
  routes
});

export default router;
