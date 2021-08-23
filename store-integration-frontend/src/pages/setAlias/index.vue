<template>
  <v-col class="container " style="width : 900px; display: inline-block;">
    <PageTitle
      title="스토어 별칭 입력"
      description="연동하실 스토어의 별칭을 입력해주세요."
    />
    <v-row justify="center">
      <v-img
        v-if="selectedStore === 'Amazon'"
        style="margin-top:100px"
        :src="SVG.AmazonLogo"
        height="100"
      />

      <v-img
        v-else-if="selectedStore === 'Shopify'"
        style="margin-top:100px"
        :src="SVG.ShopifyLogo"
        height="100"
      />
      <v-img
        v-else-if="selectedStore === 'Rakuten'"
        style="margin-top:100px"
        :src="SVG.RakutenLogo"
        height="100"
      />
    </v-row>

    <v-row
      :style="{
        marginTop: '150px'
      }"
      justify="center"
      align="center"
    >
      <div>
        <input
          style="
            width: 600px;
            border: 1px solid #4d41d2;
            height: 44px;
            border-radius: 4px;
            padding: 10px;
            background: #f9fafe;"
          placeholder="예) axb_global_store"
          v-model="Aliasvalue"
          :disabled="isDupcheck === 'true'"
        />

        <div
          v-if="isDupcheck === 'false'"
          align="left"
          class="text-red ml-2 mt-1"
        >
          사용중인 별칭입니다.
        </div>
        <div
          v-else-if="isDupcheck === 'true'"
          align="left"
          class="text-green ml-2 mt-1"
        >
          사용가능한 별칭입니다.<br />
        </div>
        <div v-else class="text-green ml-2 mt-1"><br /></div>
      </div>

      <v-btn
        @click="duplicateCheck()"
        :style="{
          width: '100px',
          height: '40px',
          borderRadius: '8px'
        }"
        color="#4D41D2"
        class="mb-7  ml-5"
        :disabled="isDupcheck === 'true'"
      >
        <div
          :style="{
            fontWeight: 'bold',
            color: 'white',
            fontSize: '15px',
            paddingLeft: '5px'
          }"
        >
          중복검사
        </div>
      </v-btn>
    </v-row>
  </v-col>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import { useStore } from "vuex";
import SVG from "@/library/importSVG";
import { onBeforeRouteLeave } from "vue-router";
import { getCustomerId } from "@/library/getCustomerId";
import axios from "axios";

export default defineComponent({
  components: {
    PageTitle
  },

  setup() {
    const vuexStore = useStore();
    const selectedStore = computed(
      () => vuexStore.state.selectStore.selectedStore
    );
    const isDupcheck = computed(() => vuexStore.state.selectStore.isduplicate);
    const Aliasvalue = ref("");
    const storeFullName = computed(
      () => vuexStore.state.selectStore.storeFullName
    );

    // 별칭 중복 체크
    const duplicateCheck = () => {
      const customerId = getCustomerId();
      const formData = {
        storeAlias: Aliasvalue.value
      };
      if (Aliasvalue.value !== "") {
        axios
          .post(
            `${customerId}/${storeFullName.value}/store-alias/duplicate-check`,
            formData
          )
          .then(res => {
            console.log(res);
            vuexStore.dispatch("selectStore/updateDuplicateTrue");
            vuexStore.dispatch(
              "selectStore/updateStoreAlias",
              Aliasvalue.value
            );
          })
          .catch(error => {
            console.log(error);
            vuexStore.dispatch("selectStore/updateDuplicateFalse");
          });
      }
    };

    // 별칭입력 페이지에서 매뉴얼(다음)으로 이동할때, 별칭 중복검사를 진행했는지 확인
    onBeforeRouteLeave((to, from, next) => {
      if (
        to.fullPath === `/${selectedStore.value}` &&
        from.fullPath === "/SetAlias"
      ) {
        if (isDupcheck.value === "false" || isDupcheck.value === "") {
          alert(`${selectedStore.value} 스토어 별칭 중복검사를 진행해주세요.`);
          next(false);
        } else {
          next();
        }
      } else if (to.fullPath === "/" && from.fullPath === "/SetAlias") {
        next();
      }
    });

    // 페이지가 새로고침될 때, 페이지넘버는 2, 별칭 중복체크 상태는 null값으로 초기화
    onMounted(() => {
      vuexStore.dispatch("selectStore/updateDuplicateNull");
      vuexStore.dispatch("selectStore/updateCurrentPage", 2);
    });

    return {
      selectedStore,
      SVG,
      duplicateCheck,
      isDupcheck,
      Aliasvalue,
      storeFullName
    };
  }
});
</script>

<style></style>
