import router from "./router/router";
import { createApp } from 'vue';
import App from "./App.vue";
import "./styles/style.css";

createApp(App).use(router).mount("#app");
