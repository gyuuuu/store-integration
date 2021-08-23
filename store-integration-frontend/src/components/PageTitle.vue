<template>
  <v-col style="color : #000000" class="text-left">
    <h1 class="font-weight-bold mb-3 text-left">
      {{ title }}
    </h1>
    <h3 class="font-weight-regular">
      {{ description }}
    </h3>
  </v-col>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },

  setup() {
    return {};
  }
};
</script>

<style></style>
