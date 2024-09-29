import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/pages/HomeView.vue";
import accountRoutes from "./accountRoutes";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/:accountid",
    component: () => import("@/layouts/AccountLayout.vue"),
    children: accountRoutes, // Directly use the imported routes
  },
];

const router = createRouter({
  history: createWebHistory(), // History mode without hash
  routes,
});

export default router;
