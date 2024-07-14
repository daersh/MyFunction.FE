import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);
app.use(router);
app.use(VueSweetalert2);
app.mount('#app');
