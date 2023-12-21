import router from "@/router/router";
import App from "./App.vue";
import "./styles/style.css";

const { createApp, ref } = Vue

createApp(App).use(router).mount("#app");
