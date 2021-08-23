<template>
  <v-col class="container" style="width : 900px; display: inline-block;">
    <PageTitle
      title="스토어 연동 완료"
      description="스토어와 성공적으로 연동되었습니다."
    />
    <v-row>
      <v-img :src="SVG.Successsvg" class="my-3" contain height="400" />
    </v-row>
  </v-col>
</template>

<script>
import { computed, defineComponent, onMounted } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import { useStore } from "vuex";
import SVG from "@/library/importSVG";
import { onBeforeRouteLeave } from "vue-router";

export default defineComponent({
  components: {
    PageTitle
  },

  setup() {
    const vuexStore = useStore();
    const selectedStore = computed(
      () => vuexStore.state.selectStore.selectedStore
    );

    // 성공페이지에서 처음페이지로 이동할때 vuex에 저장된 데이터 초기화
    onBeforeRouteLeave((to, from, next) => {
      if (to.fullPath === "/" && from.fullPath === "/success") {
        vuexStore.dispatch("rakutenManual/updateInitialize");
        vuexStore.dispatch("selectStore/updateNullIsValidateKey");
        next();
      }
    });

    onMounted(() => {
      vuexStore.dispatch("selectStore/updateCurrentPage", 3);
      vuexStore.dispatch("selectStore/updateSelectedStore", "/");
    });

    return {
      selectedStore,
      SVG
    };
  }
});
</script>

<style></style>
