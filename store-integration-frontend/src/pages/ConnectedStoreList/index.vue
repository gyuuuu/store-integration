<template>
  <v-col class="container" style="width : 900px; display: inline-block;">
    <PageTitle title="연동된 스토어 목록" style="margin-bottom:10px;" />
    <ConnectedStoreListTable></ConnectedStoreListTable>
  </v-col>
</template>

<script>
import ConnectedStoreListTable from "@/pages/ConnectedStoreList/ConnectedStoreListTable.vue";
import PageTitle from "@/components/PageTitle.vue";
import SVG from "@/library/importSVG";

export default {
  components: {
    PageTitle,
    ConnectedStoreListTable
  },

  setup() {
    return {
      SVG
    };
  }
};
</script>

<style></style>
