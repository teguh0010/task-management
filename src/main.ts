import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { createPinia } from 'pinia';
import 'material-icons/iconfont/material-icons.css';
import PrimeVue from "primevue/config";
import Toast from "primevue/toast";
import Lara from "./presets/lara";
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';


import './index.css';

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(autoAnimatePlugin);
app.component("Toast", Toast);
app.use(PrimeVue, { unstyled: true, pt: Lara });
app.use(ToastService);
app.use(DialogService);


app.mount('#app');
