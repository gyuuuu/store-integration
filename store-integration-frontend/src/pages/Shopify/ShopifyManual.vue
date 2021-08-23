<template>
  <div>
    <v-row align="center" class="mt-8 mb-3" justify="center">
      <h3>
        ① 스토어 연동 링크 버튼을 클릭하여 Shopify 로그인을 진행해주세요
      </h3>
      <v-btn
        :href="appUrl"
        target="_blank"
        :style="{
          width: '200px',
          height: '40px',
          borderRadius: '8px'
        }"
        color="#4D41D2"
        class="mb-5 mt-3 ml-5"
      >
        <div
          :style="{
            fontWeight: 'bold',
            color: 'white',
            fontSize: '18px',
            paddingLeft: '5px'
          }"
        >
          스토어 연동 링크
        </div>
        <v-img :src="SVG.Btnimg" width="15px" height="15px"></v-img>
      </v-btn>
    </v-row>

    <a v-for="(Manual, i) in manualList" :key="i">
      <v-col
        :style="{
          width: '900px',
          Height: '700px',
          marginBottom: '20px'
        }"
      >
        <v-img
          height
          :style="{
            maxHeight: '700px'
          }"
          class="mb-6"
          :src="Manual.img"
        ></v-img>
        <h3>
          {{ Manual.text }}
        </h3>
      </v-col>
    </a>
  </div>
</template>

<script>
import SVG from "@/library/importSVG";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "@vue/runtime-core";
import axios from "axios";
import { getCustomerId } from "@/library/getCustomerId";

export default {
  props: {
    manualList: {
      type: Array,
      required: true
    }
  },
  setup() {
    const appUrl = ref("");
    const vuexStore = useStore();
    const storeFullName = computed(
      () => vuexStore.state.selectStore.storeFullName
    );

    //  app install link get
    onMounted(async () => {
      const customerId = getCustomerId();
      axios
        .get(`${customerId}/shopify/install-link`, {
          params: {
            storeName: storeFullName.value
          }
        })
        .then(Response => {
          appUrl.value = Response.data.data;
        })
        .catch(Error => {
          console.log(Error);
        });
    });

    return {
      SVG,
      appUrl,
      storeFullName
    };
  }
};
</script>

<style></style>
