<template>
  <div class="form-group" style="margin-bottom: 30px;">
    <input
      @blur="validateInput()"
      class="keyinput"
      v-model="value"
      type="text"
      :placeholder="placeholder"
      :disabled="isValidateKey === 'true' || isKeyInput === 'false'"
    />
    <!-- 1. 유효성검사 버튼을 클릭하지 않았을 때 -->
    <div v-if="validateBtnPressed === false">
      <br />
    </div>

    <!-- 2. 유효성검사 버튼을 클릭했을 때 -->
    <div
      v-else-if="validateBtnPressed === true"
      align="left"
      style="margin-left:22px"
    >
      <!-- 2-1. 입력받는칸, 입력값이 없어 유효성검사가 진행 되지 않았을 때 -->
      <div v-if="isKeyInput === 'true' && value.length < 1" class="text-red">
        This field is required
      </div>
      <!-- 2-2. 유효성검사가 진행 되었을 때 -->
      <div
        v-else-if="isValidateKey !== ''"
        :style="
          isValidateKey === 'true' ? { color: 'green' } : { color: 'red' }
        "
      >
        {{ validateErrorMessage }}
      </div>
      <div v-else>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    placeholder: {
      type: String,
      required: true
    },
    validateBtnPressed: {
      type: Boolean,
      required: true
    },
    // isKeyInput -> 'true': 키값을 입력받는폼 , 'false': 키값을 입력 받지않는 폼
    isKeyInput: {
      type: String,
      required: true
    },
    isValidateKey: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const vuexStore = useStore();
    const value = ref("");
    const validateErrorMessage = ref("");

    // 유효성 검사 성공여부(isValidateKey)에 따른 error message
    watchEffect(() => {
      if (props.isValidateKey === "true") {
        validateErrorMessage.value = "Validate Success!!";
      } else if (props.isValidateKey === "false") {
        validateErrorMessage.value = "Validate Error";
      } else if (props.isValidateKey === "400") {
        validateErrorMessage.value = "API KEY 가 정보가 존재하지 않습니다.";
      } else if (props.isValidateKey === "401") {
        validateErrorMessage.value = "유효하지 않은 토큰입니다.";
      }
    });

    // input에 입력한 값을 vuex에 저장
    const validateInput = () => {
      vuexStore.dispatch("rakutenManual/updateValue", {
        type: props.placeholder,
        data: value.value
      });
    };

    return {
      value,
      validateErrorMessage,
      validateInput
    };
  }
};
</script>

<style>
.keyinput {
  margin: 12px;
  width: 408px;
  border: 1px solid #4d41d2;
  height: 44px;
  border-radius: 4px;
  padding: 10px;
  background: #f9fafe;
}
</style>
