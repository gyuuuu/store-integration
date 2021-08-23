// interface updateValuePayload {
//   type: string; // licenseKey 인지, serviceSecretKey인지, Day 인지 등등
//   data: string; // 인풋으로 들어온 값
// }

// export default {
//   namespaced: true,
//   state: {
//     isValidateKey: ""
//   },
//   mutations: {
//     UPDATE_TRUE_ISVALIDATEKEY(state: any) {
//       state.isValidateKey = "true";
//     },
//     UPDATE_FALSE_ISVALIDATEKEY(state: any) {
//       state.isValidateKey = "false";
//     },
//     UPDATE_400_ISVALIDATEKEY(state: any) {
//       state.isValidateKey = "400";
//     },
//     UPDATE_401_ISVALIDATEKEY(state: any) {
//       state.isValidateKey = "401";
//     },
//     UPDATE_INITIALIZATION(state: any) {
//       state.isValidateKey = "";
//     }
//   },
//   actions: {
//     updataTrueIsValidateKey({ commit }: any) {
//       commit("UPDATE_TRUE_ISVALIDATEKEY");
//     },
//     updataFalseIsValidateKey({ commit }: any) {
//       commit("UPDATE_FALSE_ISVALIDATEKEY");
//     },
//     updata400IsValidateKey({ commit }: any) {
//       commit("UPDATE_400_ISVALIDATEKEY");
//     },
//     updata401IsValidateKey({ commit }: any) {
//       commit("UPDATE_401_ISVALIDATEKEY");
//     },
//     updateInitialize({ commit }: any) {
//       commit("UPDATE_INITIALIZATION");
//     }
//   }
// };
