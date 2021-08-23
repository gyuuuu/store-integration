<template>
  <v-container>
    <v-col>
      <v-row justify="center" class="mr-5">
        <div
          v-for="(store, i) in toConnectedStoreList"
          :key="i"
          class="subheading mx-3"
        >
          <v-card>
            <v-btn
              @click="onStoreClick(store.text)"
              :style="{
                color: '#5D38F0'
              }"
              width="180"
              height="180"
            >
              <v-img :src="store.img" width="130" height="130"></v-img>
            </v-btn>
          </v-card>
          <div
            style="
              color: #261c4c;
              font-size: 18px;
              margin-top: 16px;
              font-weight: bold;
              margin-bottom: 30px; "
          >
            {{ store.text }}
          </div>
        </div>
      </v-row>
    </v-col>
    <v-col> </v-col>
  </v-container>
</template>

<script>
import { useStore } from "vuex";

export default {
  props: {
    toConnectedStoreList: {
      type: Array,
      required: true
    }
  },
  setup() {
    const vuexStore = useStore();

    // 스토어 선택시, 선택한 스토어의 이름 vuex에 저장
    const onStoreClick = storeFullName => {
      vuexStore.dispatch(
        "selectStore/updateSelectedStore",
        storeFullName.split("_")[0]
      );
      vuexStore.dispatch("selectStore/updateStoreFullName", storeFullName);
    };

    return {
      onStoreClick
    };
  }
};
</script>

<style></style>
