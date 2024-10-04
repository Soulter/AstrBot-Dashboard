import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import VueApexCharts from 'vue3-apexcharts';

import print from 'vue3-print-nb';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(print);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');
