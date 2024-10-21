import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/pages/HomeView.vue";
import accountRoutes from "./accountRoutes";
import { useAccountStore } from "@/store/account";
import { storeToRefs } from "pinia";
import { watch, nextTick } from "vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    meta: { title: "Fixtura Home" },
    component: HomeView,
  },
  {
    path: "/:accountid",
    name: "account",
    meta: { title: `Fixtura Account` },
    component: () => import("@/layouts/AccountLayout.vue"),
    children: accountRoutes, // Use the imported child routes
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore();
  const { getAccountName } = storeToRefs(accountStore);

  let dynamicTitle = to.meta.title;

  // Dynamically adjust the title based on route params
  if (to.params.sport) {
    dynamicTitle = `${to.params.sport} Overview - Fixtura`;
  }
  if (to.params.renderid) {
    dynamicTitle = `${to.params.renderid} - Fixtura`;
  }
  if (to.params.groupingcategory) {
    dynamicTitle = `${to.params.renderid} - ${to.params.groupingcategory} - Fixtura`;
  }
  if (to.params.asset) {
    dynamicTitle = `${to.params.renderid} - ${to.params.groupingcategory} - ${to.params.asset} - Fixtura`;
  }

  // Watch for changes in the Pinia store if needed
  watch(
    getAccountName,
    async (newVal) => {
      if (newVal) {
        await nextTick();
        // Set the title with the account name and the dynamic title
        document.title = `${newVal} - ${dynamicTitle}`;
      } else {
        // Set the dynamic title for non-account specific pages
        document.title = dynamicTitle as string;
      }
    },
    { immediate: true }
  );

  next();
});

export default router;
