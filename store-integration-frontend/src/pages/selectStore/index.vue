<template>
  <v-col class="container" style="width : 900px; display: inline-block;">
    <PageTitle
      title="스토어 선택"
      description="연동하실 스토어를 선택해주세요"
    />
    <v-row>
      <v-img :src="SVG.Selectlogo" height="400" />
    </v-row>
    <SelectStore :toConnectedStoreList="storeList" />
  </v-col>
  <div style="height:30px"></div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import SelectStore from "@/pages/selectStore/SelectStore.vue";
import { useStore } from "vuex";
import SVG from "@/library/importSVG";
import axios from "axios";
import { getCustomerId } from "@/library/getCustomerId";
import { getDummyStore } from "@/library/getStore";
import { getImg } from "@/library/getImg";
import { onBeforeRouteLeave } from "vue-router";

export default defineComponent({
  name: "Store Select",
  components: {
    PageTitle,
    SelectStore
  },

  setup() {
    const vuexStore = useStore();

    const storeList = ref([]);

    const selectedStore = computed(
      () => vuexStore.state.selectStore.selectedStore
    );

    onBeforeRouteLeave((to, from, next) => {
      if (to.fullPath === "/SetAlias" && from.fullPath === "/") {
        if (selectedStore.value === "") {
          alert("스토어를 선택해주세요");
          next(false);
        } else {
          next();
        }
      }
    });

    onMounted(() => {
      // 스토어선택 페이지이동 시, vuex 데이터 초기화
      vuexStore.dispatch("selectStore/updateNullIsValidateKey");
      vuexStore.dispatch("selectStore/updateDuplicateNull");
      vuexStore.dispatch("selectStore/updateCurrentPage", 1);
      vuexStore.dispatch("selectStore/updateSelectedStore", "");

      const customerId = getCustomerId();

      // 연동할 스토어 목록 get
      axios
        .get(`${customerId}/to-connect-stores`)
        .then(response => {
          response.data.data.forEach(storeName => {
            storeList.value.push({
              text: storeName,
              img: getImg(storeName.split("_")[0])
            });
          });
        })
        .catch(error => {
          console.log(error);
          storeList.value = getDummyStore();
        });
    });

    return {
      SVG,
      storeList
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Lato;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
