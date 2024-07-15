import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import WritePage from '@/components/WritePage.vue';
import NotionPages from '@/components/NotionPages.vue';
import Chat from '@/components/Chat.vue';
import Map from '@/components/Map.vue';

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
  }

];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
