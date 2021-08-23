<template>
  <div>
    <v-row align="center" class="mt-8 mb-3" justify="center">
      <h3>
        ① 라쿠텐 RMS로 이동을 클릭하여 로그인을 진행해주세요
      </h3>
      <v-btn
        :href="'https://glogin.rms.rakuten.co.jp/?sp_id=1'"
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
            fontSize: '15px',
            paddingLeft: '5px'
          }"
        >
          라쿠텐 RMS로 이동
        </div>
        <v-img :src="SVG.Btnimg" width="15px" height="15px"></v-img>
      </v-btn>
    </v-row>

    <a v-for="(Manual, i) in manualList" :key="i">
      <v-col
        :style="{
          width: '900px',
          height: '443.17px',
          marginBottom: '100px'
        }"
      >
        <v-img class="mb-6" :src="Manual.img"></v-img>
        <h3>
          {{ Manual.text }}
        </h3>
      </v-col>
    </a>
    <h3>
      ⑤ API KEY 확인버튼을 클릭하여 KEY 유효성 검사를 진행해주세요
    </h3>
  </div>
</template>

<script>
import SVG from "@/library/importSVG";

export default {
  props: {
    manualList: {
      type: Array,
      required: true
    }
  },

  setup() {
    return {
      SVG
    };
  }
};
</script>

<style></style>
