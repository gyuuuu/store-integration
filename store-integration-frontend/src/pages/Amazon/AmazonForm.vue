<template>
  <form @submit.prevent="validateKey()" :style="{ marginTop: '50px' }">
    <v-row justify="center">
      <KeyInputForm
        :isValidateKey="isValidateKey"
        :validateBtnPressed="validateBtnPressed"
        :placeholder="placeholder"
        isKeyInput="false"
      />

      <v-btn
        type="submit"
        :style="{
          width: '130px',
          height: '44px',
          borderRadius: '4px'
        }"
        color="#4D41D2"
        class="mb-5 mt-3"
        :disabled="isValidateKey === 'true'"
      >
        <div
          v-if="loader === ''"
          :style="{
            fontWeight: 'bold',
            color: 'white',
            fontSize: '16px'
          }"
        >
          Token 확인
        </div>

        <div v-else-if="loader === 'true'" class="loader"></div>
      </v-btn>
    </v-row>
  </form>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import KeyInputForm from "@/components/KeyInputForm.vue";
import { getCustomerId } from "@/library/getCustomerId";

export default {
  components: {
    KeyInputForm
  },

  setup() {
    const loader = ref("");
    const placeholder = ref("Refresh Token");
    const validateBtnPressed = ref(false);
    const vuexStore = useStore();
    const isValidateKey = computed(
      () => vuexStore.state.selectStore.isValidateKey
    );
    const storeFullName = computed(
      () => vuexStore.state.selectStore.storeFullName
    );

    // 키값 유효성 검사
    const validateKey = async () => {
      validateBtnPressed.value = true;
      const customerId = getCustomerId();
      try {
        loader.value = "true";
        const response = await axios.get(`${customerId}/amazon/refresh-token`, {
          params: {
            storeName: storeFullName.value
          }
        });
        loader.value = "";
        placeholder.value =
          response.data.data.refreshToken.slice(0, 5) + "*************";
        if (response.data.data.isValidate === true) {
          vuexStore.dispatch("selectStore/updataTrueIsValidateKey");
        } else {
          vuexStore.dispatch("selectStore/updataFalseIsValidateKey");
        }
      } catch (error) {
        loader.value = "";
        if (error.response.status === 400) {
          console.log("no token");
          vuexStore.dispatch("selectStore/updata400IsValidateKey");
        } else {
          console.log("no valid");
          vuexStore.dispatch("selectStore/updata401IsValidateKey");
        }
      }
    };

    return {
      loader,
      validateBtnPressed,
      isValidateKey,
      validateKey,
      storeFullName,
      placeholder
    };
  }
};
</script>

<style>
.loader {
  border: 3px solid #4d41d2;
  border-top: 3px solid #f3f3f3;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}
</style>
