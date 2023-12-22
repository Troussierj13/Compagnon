import router from "./router/router";
import { createApp } from "../node_modules/vue";
import App from "./App.vue";
import "./styles/style.css";

createApp(App).use(router).mount("#app");
