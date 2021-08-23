export default {
  namespaced: true,
  state: {
    currentPage: 1,
    selectedStore: "",
    storeFullName: "",
    isduplicate: "",
    storeAlias: "",
    isValidateKey: ""
  },
  mutations: {
    GOTO_FIRSTPAGE(state: any) {
      state.currentPage = 1;
    },
    GOTO_SECONDTPAGE(state: any) {
      state.currentPage = 2;
    },
    GOTO_THIRDPAGE(state: any) {
      state.currentPage = 3;
    },
    GOTO_FOURTHDPAGE(state: any) {
      state.currentPage = 4;
    },
    GOTO_NINEPAGE(state: any) {
      state.currentPage = 9;
    },
    UPDATE_SELECTEDSTORE(state: any, payload: string) {
      state.selectedStore = payload;
    },
    UPDATE_STOREFULLNAME(state: any, payload: string) {
      state.storeFullName = payload;
    },
    UPDATE_DUPLICATETRUE(state: any) {
      state.isduplicate = "true";
    },
    UPDATE_DUPLICATEFALSE(state: any) {
      state.isduplicate = "false";
    },
    UPDATE_DUPLICATENULL(state: any) {
      state.isduplicate = "";
    },
    UPDATE_STOREALIAS(state: any, payload: string) {
      state.storeAlias = payload;
    },
    UPDATE_TRUE_ISVALIDATEKEY(state: any) {
      state.isValidateKey = "true";
    },
    UPDATE_FALSE_ISVALIDATEKEY(state: any) {
      state.isValidateKey = "false";
    },
    UPDATE_400_ISVALIDATEKEY(state: any) {
      state.isValidateKey = "400";
    },
    UPDATE_401_ISVALIDATEKEY(state: any) {
      state.isValidateKey = "401";
    },
    UPDATE_INITIALIZATION(state: any) {
      state.isValidateKey = "";
    }
  },
  actions: {
    updateCurrentPage({ commit }: any, pageNum: number) {
      switch (pageNum) {
        case 1:
          commit("GOTO_FIRSTPAGE");
          break;
        case 2:
          commit("GOTO_SECONDTPAGE");
          break;
        case 3:
          commit("GOTO_THIRDPAGE");
          break;
        case 4:
          commit("GOTO_FOURTHDPAGE");
          break;
        case 9:
          commit("GOTO_NINEPAGE");
          break;

        default:
          break;
      }
    },
    updateSelectedStore({ commit }: any, storeName: string) {
      commit("UPDATE_SELECTEDSTORE", storeName);
    },
    updateStoreFullName({ commit }: any, storeFullName: string) {
      commit("UPDATE_STOREFULLNAME", storeFullName);
    },
    updateDuplicateTrue({ commit }: any) {
      commit("UPDATE_DUPLICATETRUE");
    },
    updateDuplicateFalse({ commit }: any) {
      commit("UPDATE_DUPLICATEFALSE");
    },
    updateDuplicateNull({ commit }: any) {
      commit("UPDATE_DUPLICATENULL");
    },
    updateStoreAlias({ commit }: any, storeAlias: string) {
      commit("UPDATE_STOREALIAS", storeAlias);
    },
    updataTrueIsValidateKey({ commit }: any) {
      commit("UPDATE_TRUE_ISVALIDATEKEY");
    },
    updataFalseIsValidateKey({ commit }: any) {
      commit("UPDATE_FALSE_ISVALIDATEKEY");
    },
    updata400IsValidateKey({ commit }: any) {
      commit("UPDATE_400_ISVALIDATEKEY");
    },
    updata401IsValidateKey({ commit }: any) {
      commit("UPDATE_401_ISVALIDATEKEY");
    },
    updateNullIsValidateKey({ commit }: any) {
      commit("UPDATE_INITIALIZATION");
    }
  }
};
