<template>
  <div class="chat-window">
    <div class="chat-header">
      <h3>Chat with {{ contact }}</h3>
    </div>
    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message._id"
        :class="['message', { 'sent': message.senderId === currentUser }]"
      >
        <div class="message-content">
          {{ message.content }}
        </div>
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
    <div class="input-container">
  <span class="user-label">{{ currentUser }}:</span>
  <input 
    v-model="newMessage"
    placeholder="Type your message..."
    @keyup.enter="send"
  >
  <button @click="send">Send</button>
</div>
  </div>
</template>

<script>
import { ref, onUpdated, nextTick } from 'vue';

export default {
  props: {
    messages: {
      type: Array,
      required: true
    },
    currentUser: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    isVendor: {
      type: Boolean,
      required: true
    }
  },
  emits: ['send-message'],
  setup(props, { emit }) {
    const newMessage = ref('');
    const messagesContainer = ref(null);

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = async () => {
      await nextTick();
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };

    const send = () => {
      if (newMessage.value.trim()) {
        emit('send-message', newMessage.value.trim());
        newMessage.value = '';
      }
    };

    onUpdated(() => {
      scrollToBottom();
    });

    return {
      newMessage,
      messagesContainer,
      formatTime,
      send
    };
  }
};
</script>

<style scoped>

.user-label {
  padding: 8px;
  color: #666;
  font-weight: 500;
}

.chat-window {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #ccc;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f0f0f0;
  align-self: flex-start;
}

.message.sent {
  background-color: #e3f2fd;
  align-self: flex-end;
}

.message-content {
  margin-bottom: 4px;
}

.message-time {
  font-size: 0.8em;
  color: #666;
  text-align: right;
}

.input-container {
  padding: 15px;
  border-top: 1px solid #ccc;
  display: flex;
  gap: 10px;
}

.input-container input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-container button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-container button:hover {
  background-color: #1565c0;
}
</style>