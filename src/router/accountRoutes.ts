import { RouteRecordRaw } from "vue-router";
import AccountView from "@/pages/account/AccountView.vue";
import SportView from "@/pages/sport/SportView.vue";
import RenderView from "@/pages/render/RenderView.vue";
import GroupingCategoryView from "@/pages/grouping/GroupingCategoryView.vue";
import AssetView from "@/pages/asset/AssetView.vue";

const accountRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    component: AccountView,
  },
  {
    path: ":sport/",
    component: SportView,
  },
  {
    path: ":sport/:renderid/",
    component: RenderView,
  },
  {
    path: ":sport/:renderid/:groupingcategory/",
    component: GroupingCategoryView,
  },
  {
    path: ":sport/:renderid/:groupingcategory/:asset/",
    component: AssetView,
  },
];

export default accountRoutes;
