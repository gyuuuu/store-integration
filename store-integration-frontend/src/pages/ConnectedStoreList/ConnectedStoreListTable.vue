<template>
  <table style="border-collapse: collapse;">
    <thead style="height: 60px; ">
      <tr
        style="border-bottom: 1px solid #F3F3F3; font-size: 17px;
            color: #9B9DCF; "
      >
        <th
          style="
            width: 150px;
            "
          class="text-center"
        >
          연동상태
        </th>
        <th
          style="
            width: 250px;
            padding-left:25px
            "
          class="text-left"
        >
          스토어
        </th>
        <th
          style="
            width: 100px;
            "
          class="text-center"
        >
          키 값
        </th>
        <th
          style="
            width: 250px;
            "
          class="text-center"
        >
          만료일
        </th>
        <th
          style="
            width: 150px;
            "
          class="text-center"
        >
          서버상태
        </th>
      </tr>
    </thead>

    <tbody align="center" style=" margin-top: 200px;">
      <tr
        v-for="(item, index) in connectedStoreList"
        :key="index"
        style=" height : 60px; border-bottom: 1px solid #F3F3F3; font-size: 16px;"
      >
        <td>
          <v-img
            v-show="item.expires_avaliable && item.isValidate === 'true'"
            :src="SVG.Check2Icon"
            width="28px"
            height="25px"
          ></v-img>
          <v-img
            v-show="!item.expires_avaliable || item.isValidate === 'false'"
            :src="SVG.X2Icon"
            width="28px"
            height="25px"
          ></v-img>
        </td>

        <td style="font-size:16px; font-weight: bold;" align="left">
          <v-img
            :src="item.img"
            width="30px"
            height="26px"
            style="float:left; padding-left:50px"
          ></v-img>
          {{ item.alias ?? item.text }}
        </td>
        <td>
          <!-- rakuten만 toolTip으로 키값 보여줌 -->
          <v-btn
            v-if="item.text.split('_')[0] === 'Rakuten'"
            @click="item.toolTip = true"
            @blur="item.toolTip = false"
          >
            <v-img
              :src="SVG.KeyIcon"
              width="22px"
              height="12px"
              style="display: inline-block;"
              class="keyicon"
            ></v-img
          ></v-btn>

          <span v-if="item.toolTip === true" class="tooltip"
            >licenseKey : {{ connectedStoreList[index].keys.licenseKey }} <br />
            ServieceSecretKey :
            {{ connectedStoreList[index].keys.serviceSecret }}
          </span>
        </td>
        <td
          style="font-size:16px; font-weight: bold;"
          :style="
            !item.expires_avaliable
              ? { color: '#FF6565' }
              : { color: '#261C4C' }
          "
        >
          {{ item.expires }}
        </td>
        <td v-if="item.isValidate === 'loading'">
          <div class="loader"></div>
        </td>
        <td
          v-else-if="item.isValidate === 'true'"
          style="font-size:16px; font-weight: bold;"
          :style="{ color: 'black' }"
        >
          정상
        </td>
        <td
          v-else
          style="font-size:16px; font-weight: bold;"
          :style="{ color: '#FF6565' }"
        >
          일시적 장애
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import SVG from "@/library/importSVG";
import axios from "axios";
import { getImg } from "@/library/getImg";
import { getCustomerId } from "@/library/getCustomerId";

export default {
  setup() {
    const connectedStoreList = ref([]);
    const vuexStore = useStore();

    onMounted(async () => {
      // 페이지 전환시 스크롤 up
      window.scrollTo(0, 0);

      vuexStore.dispatch("selectStore/updateCurrentPage", 9);

      const customerId = getCustomerId();

      // 연동된 스토어의 정보를 받아옴
      const response = await axios.get(`${customerId}/connected-stores`);

      for (let index in response.data.data) {
        // 연동된 스토어의 정보를 connectedStoreList 배열에 push
        connectedStoreList.value.push({
          text: response.data.data[index].storeName,
          alias: response.data.data[index].storeAlias,
          img: getImg(response.data.data[index].storeName.split("_")[0]),
          expires: response.data.data[index].expires.expiresValue,
          expires_avaliable: response.data.data[index].expires.available,
          keys: response.data.data[index].keys,
          isValidate: "loading",
          toolTip: false
        });
        validatecheck(index, connectedStoreList.value[index]);
      }
    });

    // 유효성 체크
    const validatecheck = (index, storeData) => {
      const customerId = getCustomerId();
      switch (storeData.text.split("_")[0]) {
        case "Rakuten": {
          const formData = {
            serviceSecret: storeData.keys.serviceSecret,
            licenseKey: storeData.keys.licenseKey
          };

          axios
            .post(`${customerId}/rakuten/validation-key`, formData)
            .then(() => {
              connectedStoreList.value[index].isValidate = "true";
            })
            .catch(() => {
              connectedStoreList.value[index].isValidate = "false";
            });
          break;
        }

        case "Amazon": {
          axios
            .get(`${customerId}/amazon/refresh-token`, {
              params: {
                storeName: storeData.text
              }
            })
            .then(() => {
              connectedStoreList.value[index].isValidate = "true";
            })
            .catch(() => {
              connectedStoreList.value[index].isValidate = "false";
            });
          break;
        }

        case "Shopify": {
          axios
            .get(`${customerId}/shopify/access-token`, {
              params: {
                storeName: storeData.text
              }
            })
            .then(() => {
              connectedStoreList.value[index].isValidate = "true";
            })
            .catch(() => {
              connectedStoreList.value[index].isValidate = "false";
            });
          break;
        }
      }
    };

    return {
      SVG,
      connectedStoreList,
      validatecheck
    };
  }
};
</script>

<style>
.tooltip {
  margin-bottom: 10px;
  margin-left: 10px;
  text-align: left;
  font-weight: bold;
  position: absolute;

  width: 350px;
  border-radius: 5px;
  padding: 6px;
  font-size: 14px;
  line-height: 15px;
  color: white;
  background: #1e1e1e;
}

.loader {
  border: 5px solid #4d41d2;
  border-top: 3px solid #f3f3f3;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}
</style>
