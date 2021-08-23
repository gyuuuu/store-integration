import { createApp } from "vue";

import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./vuexStore";

const app = createApp(App);
app.use(vuetify);
app.use(store);
app.use(router);

app.mount("#app");
