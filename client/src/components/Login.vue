<template>
  <div class="login-container">
    <h2>{{ isVendor ? 'Vendor Login' : 'User Login' }}</h2>
    <div class="login-form">
      <input 
        v-model="id" 
        :placeholder="isVendor ? 'Enter Vendor ID' : 'Enter User ID'"
        @keyup.enter="handleLogin"
      >
      <button @click="handleLogin">Login</button>
      <button @click="toggleUserType">
        Switch to {{ isVendor ? 'User' : 'Vendor' }} Login
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['login'],
  setup(props, { emit }) {
    const id = ref('');
    const isVendor = ref(false);

    const handleLogin = () => {
      if (id.value.trim()) {
        emit('login', {
          userId: id.value.trim(),
          isVendor: isVendor.value
        });
      }
    };

    const toggleUserType = () => {
      isVendor.value = !isVendor.value;
    };

    return {
      id,
      isVendor,
      handleLogin,
      toggleUserType
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, button {
  padding: 8px;
  margin: 5px;
}
</style>