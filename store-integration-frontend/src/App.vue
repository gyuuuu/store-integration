<template>
  <v-container fluid style="text-align: center;">
    <router-view />
  </v-container>
  <!-- 연동된스토어목록은 footer 표시 x -->
  <footer
    v-if="currentPage !== 9"
    style=" background-color: white;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 70px;
      box-shadow: 2px 3px 5px 0px;"
  >
    <StoreIntegrateFooter :storeName="selectedStore" />
  </footer>
</template>

<script>
import { computed, defineComponent } from "vue";
import StoreIntegrateFooter from "@/components/StoreFooter.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    StoreIntegrateFooter
  },

  setup() {
    const vuexStore = useStore();
    const currentPage = computed(() => vuexStore.state.selectStore.currentPage);
    const selectedStore = computed(
      () => vuexStore.state.selectStore.selectedStore
    );

    return {
      selectedStore,
      currentPage
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
