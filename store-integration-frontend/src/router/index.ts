import { createRouter, createWebHistory } from "vue-router";
import SelectStore from "@/pages/selectStore/index.vue";
import SetAlias from "@/pages/setAlias/index.vue";
import Rakuten from "@/pages/rakuten/index.vue";
import Amazon from "@/pages/Amazon/index.vue";
import Shopify from "@/pages/Shopify/index.vue";
import Success from "@/pages/success/index.vue";
import connectedStoreList from "@/pages/ConnectedStoreList/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "SelectStore",
      component: SelectStore
    },
    {
      path: "/SetAlias",
      name: "SetAlias",
      component: SetAlias
    },
    {
      path: "/Rakuten",
      name: "Rakuten",
      component: Rakuten
    },
    {
      path: "/Amazon",
      name: "Amazon",
      component: Amazon
    },
    {
      path: "/Shopify",
      name: "Shopify",
      component: Shopify
    },
    {
      path: "/success",
      name: "success",
      component: Success
    },
    {
      path: "/connectedStoreList",
      name: "connectedStoreList",
      component: connectedStoreList
    }
  ]
});

export default router;
