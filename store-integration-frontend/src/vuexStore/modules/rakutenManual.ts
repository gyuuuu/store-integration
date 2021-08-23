interface updateValuePayload {
  type: string; // licenseKey 인지, serviceSecretKey인지, Day 인지 등등
  data: string; // 인풋으로 들어온 값
}

export default {
  namespaced: true,
  state: {
    licenseKey: "",
    serviceSecretKey: "",
    expiredate: ""
  },
  mutations: {
    UPDATE_LICENSEKEY(state: any, payload: string) {
      state.licenseKey = payload;
    },
    UPDATE_SERVICESECRETKEY(state: any, payload: string) {
      state.serviceSecretKey = payload;
    },
    UPDATE_EXPIREDATE(state: any, payload: string) {
      state.expiredate = payload;
    },
    UPDATE_INITIALIZATION(state: any) {
      (state.licenseKey = ""),
        (state.serviceSecretKey = ""),
        (state.expiredate = "");
    }
  },
  actions: {
    updateValue({ commit }: any, payload: updateValuePayload) {
      switch (payload.type) {
        case "licenseKey":
          commit("UPDATE_LICENSEKEY", payload.data);
          break;
        case "serviceSecretKey":
          commit("UPDATE_SERVICESECRETKEY", payload.data);
          break;
        case "유효기간":
          commit("UPDATE_EXPIREDATE", payload.data);
          break;
        default:
          break;
      }
    },
    updateInitialize({ commit }: any) {
      commit("UPDATE_INITIALIZATION");
    }
  }
};
