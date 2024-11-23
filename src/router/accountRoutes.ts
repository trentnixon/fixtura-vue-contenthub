import { RouteRecordRaw } from "vue-router";
import AccountView from "@/pages/account/AccountView.vue";
import SportView from "@/pages/sport/SportView.vue";
import RenderView from "@/pages/render/RenderView.vue";
import GroupingCategoryView from "@/pages/grouping/GroupingCategoryView.vue";
import AssetView from "@/pages/asset/AssetView.vue";
import VideoEdit from "@/pages/edit/processEdit.vue";

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
  // Separate edit routes for each asset type
  {
    path: "edit/processEdit",
    name: "processEdit",
    component: VideoEdit,
    meta: { title: "Edit" },
  },
];

export default accountRoutes;
