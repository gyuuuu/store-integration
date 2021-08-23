<template>
  <v-col class="container" style="width : 900px; display: inline-block;">
    <v-img :src="SVG.ShopifyLogo" width="260px" height="80px"></v-img>
    <PageTitle
      title="스토어 연동 절차"
      description="아래의 메뉴얼을 참조하여 스토어 연동을 진행해주세요."
    />
    <v-divider></v-divider>

    <ShopifyManual :manualList="manualList" />

    <v-divider :style="{ marginTop: '50px' }"></v-divider>

    <ShopifyForm />

    <div style="height:50px"></div>
  </v-col>
</template>

<script>
import { getShopifyManual } from "@/library/getManual";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";
import ShopifyManual from "@/pages/Shopify/ShopifyManual.vue";
import ShopifyForm from "@/pages/Shopify/ShopifyForm.vue";

import SVG from "@/library/importSVG";
import { onBeforeRouteLeave } from "vue-router";

export default {
  components: {
    PageTitle,
    ShopifyManual,
    ShopifyForm
  },

  setup() {
    const manualList = ref([]);
    const vuexStore = useStore();
    const isValidateKey = computed(
      () => vuexStore.state.selectStore.isValidateKey
    );
    // 연동되지 않았을 때, 이전화면으로 가면 alert
    onBeforeRouteLeave((to, from, next) => {
      if (to.fullPath === "/SetAlias" && from.fullPath === "/Shopify") {
        vuexStore.dispatch("selectStore/updateSelectedStore", "Shopify");
        if (isValidateKey.value !== "") {
          if (
            confirm("아직 저장되지 않았습니다. 이전화면으로 가시겠습니까?") ===
            true
          ) {
            vuexStore.dispatch("selectStore/updateNullIsValidateKey");
            next();
          } else {
            next(false);
          }
        } else {
          next();
        }
      } else {
        next();
      }
      console.log(isValidateKey.value);
    });

    onMounted(() => {
      // 페이지 전환시 스크롤 up
      window.scrollTo(0, 0);

      vuexStore.dispatch("selectStore/updateCurrentPage", 3);
      vuexStore.dispatch("selectStore/updateSelectedStore", "success");
      manualList.value = getShopifyManual();
    });

    return {
      SVG,
      isValidateKey,
      manualList
    };
  }
};
</script>

<style></style>
