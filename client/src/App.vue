<template>
  <div class="app-container">
    <Login v-if="!isLoggedIn" @login="handleLogin" />
    <ChatInterface v-else />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Login from './components/Login.vue';
import ChatInterface from './components/ChatInterface.vue';

export default {
  components: {
    Login,
    ChatInterface
  },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.state.userId !== null);

    const handleLogin = (data) => {
      store.commit('setUserId', data.userId);
      store.commit('setIsVendor', data.isVendor);
    };

    return {
      isLoggedIn,
      handleLogin
    };
  }
};
</script>

<style>
.app-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}
</style>