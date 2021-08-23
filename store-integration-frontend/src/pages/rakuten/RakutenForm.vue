<template>
  <form @submit.prevent="validateKey()" :style="{ marginTop: '50px' }">
    <v-col>
      <v-row justify="center">
        <KeyInputForm
          :isValidateKey="isValidateKey"
          :validateBtnPressed="validateBtnPressed"
          placeholder="licenseKey"
          isKeyInput="true"
        />
        <div>
          <datepicker
            @blur="validateInput()"
            class="dateinput"
            v-model="picked"
            placeholder="유효기간"
            :disabled="isValidateKey === 'true'"
          />
          <div
            v-if="validateBtnPressed === true && expiredate.length < 1"
            class="text-red"
          >
            This field is required
          </div>
        </div>
      </v-row>

      <v-row justify="center">
        <KeyInputForm
          class="ml-n3"
          :isValidateKey="isValidateKey"
          :validateBtnPressed="validateBtnPressed"
          placeholder="serviceSecretKey"
          isKeyInput="true"
        />

        <v-btn
          type="submit"
          :style="{
            width: '149px',
            height: '44px',
            borderRadius: '4px'
          }"
          color="#4D41D2"
          class="mb-5 mt-3 ml-2"
          :disabled="isValidateKey === 'true'"
        >
          <div
            :style="{
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px'
            }"
          >
            API KEY 확인
          </div>
        </v-btn>
      </v-row>
    </v-col>
  </form>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { getCustomerId } from "@/library/getCustomerId";
import KeyInputForm from "@/components/KeyInputForm.vue";
import Datepicker from "vue3-datepicker";

export default {
  components: {
    KeyInputForm,
    Datepicker
  },

  setup() {
    const picked = ref();

    const validateBtnPressed = ref(false);
    const vuexStore = useStore();
    const isValidateKey = computed(
      () => vuexStore.state.selectStore.isValidateKey
    );

    const licenseKey = computed(() => vuexStore.state.rakutenManual.licenseKey);
    const serviceSecretKey = computed(
      () => vuexStore.state.rakutenManual.serviceSecretKey
    );
    const expiredate = computed(() => vuexStore.state.rakutenManual.expiredate);

    // 유효기간 vuex에 저장
    const validateInput = () => {
      vuexStore.dispatch("rakutenManual/updateValue", {
        type: "유효기간",
        data: picked.value.toLocaleDateString()
      });
    };

    // api 유효성 체크(키값과 유효기간이 모두 입력되어야지 진행)
    const validateKey = () => {
      validateBtnPressed.value = true;
      if (
        serviceSecretKey.value != "" &&
        licenseKey.value != "" &&
        expiredate.value != ""
      ) {
        const customerId = getCustomerId();
        const formData = {
          serviceSecret: serviceSecretKey.value,
          licenseKey: licenseKey.value
        };
        axios
          .post(`${customerId}/rakuten/validation-key`, formData)
          .then(res => {
            console.log(res);
            vuexStore.dispatch("selectStore/updataTrueIsValidateKey");
          })
          .catch(error => {
            console.log(error);
            vuexStore.dispatch("selectStore/updataFalseIsValidateKey");
          });
      }
    };

    return {
      validateInput,
      picked,
      expiredate,
      validateBtnPressed,
      isValidateKey,
      licenseKey,
      serviceSecretKey,
      validateKey
    };
  }
};
</script>

<style>
.dateinput {
  margin: 11px;
  width: 149px;
  border: 1px solid #4d41d2;
  height: 44px;
  border-radius: 4px;
  padding: 10px;
  background: #f9fafe;
}
</style>
