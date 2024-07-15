import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { createNaverMap } from 'vue3-naver-maps';

const app = createApp(App);
app.use(router);
app.use(VueSweetalert2);

console.log('NAVER CLIENT ID:', import.meta.env.VITE_NAVER);
app.use(createNaverMap, {
    clientId: import.meta.env.VITE_NAVER,
    category: 'ncp',
    subModules: [],
});
app.mount('#app');
  

