
import { createStore } from 'vuex';

export default createStore({
  state: {
    userId: null,
    isVendor: false
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setIsVendor(state, isVendor) {
      state.isVendor = isVendor;
    },
    logout(state) {
      state.userId = null;
      state.isVendor = false;
    }
  }
});