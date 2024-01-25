import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/gamemode",
        name: "GameMode",
        component: () => import('../views/GameMode.vue'),
    },
    {
        path: "/legenskeeper",
        name: "LegendsKeeper",
        component: () => import('../views/LegendsKeeper.vue'),
    },
    {
        path: "/spectator",
        name: "Spectator",
        component: () => import('../views/Spectator.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
