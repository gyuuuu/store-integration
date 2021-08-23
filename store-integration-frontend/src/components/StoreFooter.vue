<template>
  <v-footer>
    <v-col />
    <!-- 페이지 넘버 (1/4) -->
    <v-col
      :style="{
        fontWeight: 'bold',
        paddingLeft: '40px',
        color: '#9B9DCF',
        fontSize: '16px'
      }"
    >
      {{ currentPage }} of 4
    </v-col>

    <!-- 버튼(이전화면 / 다음) -->
    <v-col :style="{ paddingRight: '40px' }" class="text-right">
      <!-- 이전화면 -->
      <!-- 2,3 페이지 이전화면 버튼  -->
      <router-link
        v-if="currentPage === 2 || currentPage === 3"
        style="text-decoration:none"
        tag="button"
        :to="backPage"
      >
        <v-btn
          :style="{
            width: '120px',
            height: '36px',
            borderRadius: '4px',
            marginRight: '20px'
          }"
        >
          <div
            :style="{
              fontWeight: 'bold',
              color: 'rgba(160, 160, 160, 1)',
              fontSize: '16px'
            }"
          >
            이전 화면
          </div>
        </v-btn>
      </router-link>

      <!-- 다음 -->
      <!-- 1, 2 다음 페이지 -->
      <a v-if="currentPage === 1 || currentPage === 2">
        <router-link style="text-decoration:none" tag="button" :to="nextPage">
          <v-btn
            :style="{ width: '100px', height: '36px', borderRadius: '4px' }"
            color="#4D41D2"
          >
            <div
              :style="{ fontWeight: 'bold', color: 'white', fontSize: '16px' }"
            >
              {{ nextButtonText }}
            </div>
          </v-btn>
        </router-link>
      </a>

      <!-- 3 페이지 && 유효성체크 성공일 때  -->
      <a v-if="currentPage === 3 && store_isValidateKey === 'true'">
        <router-link style="text-decoration:none" tag="button" :to="nextPage">
          <v-btn
            :style="{ width: '100px', height: '36px', borderRadius: '4px' }"
            color="#4D41D2"
            @click="onSubmit()"
          >
            <div
              :style="{ fontWeight: 'bold', color: 'white', fontSize: '16px' }"
            >
              {{ nextButtonText }}
            </div>
          </v-btn>
        </router-link>
      </a>
      <!-- 3 페이지 && 유효성체크 실패일 때 , 버튼 흑백,비활성화 -->
      <a v-else-if="currentPage === 3">
        <v-btn
          disabled
          :style="{ width: '100px', height: '36px', borderRadius: '4px' }"
          color="grey"
        >
          <div
            :style="{ fontWeight: 'bold', color: 'white', fontSize: '16px' }"
          >
            {{ nextButtonText }}
          </div>
        </v-btn>
      </a>
    </v-col>
  </v-footer>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { getCustomerId } from "@/library/getCustomerId";

export default {
  props: {
    storeName: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const nextPage = ref("");
    const backPage = ref("");
    const vuexStore = useStore();
    const currentPage = computed(() => vuexStore.state.selectStore.currentPage);

    const store_isValidateKey = computed(
      () => vuexStore.state.selectStore.isValidateKey
    );

    const storeFullName = computed(
      () => vuexStore.state.selectStore.storeFullName
    );

    const storeAlias = computed(() => vuexStore.state.selectStore.storeAlias);

    // 라쿠텐 api 정보
    const licenseKey = computed(() => vuexStore.state.rakutenManual.licenseKey);
    const serviceSecretKey = computed(
      () => vuexStore.state.rakutenManual.serviceSecretKey
    );
    const expiredate = computed(() => vuexStore.state.rakutenManual.expiredate);
    //--

    // 페이지에 따라 라우터 보내는 페이지
    watchEffect(() => {
      if (currentPage.value === 3) {
        backPage.value = "SetAlias";
        nextPage.value = props.storeName;
      } else if (currentPage.value === 2) {
        backPage.value = "/";
        nextPage.value = props.storeName;
      } else if (currentPage.value === 1) {
        nextPage.value = "SetAlias";
      }
    });

    // 페이지에 따라 버튼 텍스트 변경
    const nextButtonText = computed(() => {
      switch (currentPage.value) {
        case 1:
          return "연동";
        case 2:
          return "다음";
        case 3:
          return "완료";
        case 4:
          return "확인";

        default:
          return "끝";
      }
    });

    //DB에 api key값과 만료일, 별칭을 저장
    const onSubmit = () => {
      const customerId = getCustomerId();

      if (storeFullName.value.split("_")[0] === "Rakuten") {
        const body = {
          store: storeFullName.value,
          licenseKey: {
            expires: expiredate.value,
            value: licenseKey.value
          },
          serviceSecret: {
            expires: "",
            value: serviceSecretKey.value
          }
        };

        axios
          .post(`${customerId}/rakuten/apikey`, body)
          .then(res => console.log(res))
          .catch(error => console.log(error));
      } else if (storeFullName.value.split("_")[0] === "Amazon") {
        axios
          .put(`${customerId}/amazon/isConnected`, null, {
            params: {
              storeName: storeFullName.value
            }
          })
          .then(res => console.log(res))
          .catch(error => console.log(error));
      } else if (storeFullName.value.split("_")[0] === "Shopify") {
        axios
          .put(`${customerId}/shopify/isConnected`, null, {
            params: {
              storeName: storeFullName.value
            }
          })
          .then(res => console.log(res))
          .catch(error => console.log(error));
      }

      axios
        .post(`${customerId}/${storeFullName.value}/store-alias`, {
          storeAlias: storeAlias.value
        })
        .then(res => console.log(res))
        .catch(error => console.log(error));
    };

    return {
      nextPage,
      backPage,
      onSubmit,
      licenseKey,
      serviceSecretKey,
      expiredate,
      currentPage,
      nextButtonText,
      store_isValidateKey,
      storeAlias
    };
  }
};
</script>

<style></style>
