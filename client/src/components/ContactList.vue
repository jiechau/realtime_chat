
<template>
  <div class="contacts-container">
    <div class="new-chat">
      <input 
        v-model="newContactId"
        :placeholder="'Enter contact ID'"
        @keyup.enter="startNewChat"
      >
      <button @click="startNewChat">Start Chat</button>
    </div>
    <div class="contacts-list">
      <div
        v-for="contact in contacts"
        :key="contact"
        :class="['contact-item', { active: contact === selectedContact }]"
        @click="$emit('select-contact', contact)"
      >
        {{ contact }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    contacts: {
      type: Array,
      required: true
    },
    selectedContact: {
      type: String,
      default: null
    }
  },
  emits: ['select-contact', 'new-chat'],
  setup(props, { emit }) {
    const newContactId = ref('');

    const startNewChat = () => {
      if (newContactId.value.trim()) {
        emit('new-chat', newContactId.value.trim());
        newContactId.value = '';
      }
    };

    return {
      newContactId,
      startNewChat
    };
  }
};
</script>

<style scoped>
.contacts-container {
  width: 250px;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.new-chat {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.contacts-list {
  overflow-y: auto;
  flex-grow: 1;
}

.contact-item {
  padding: 10px;
  cursor: pointer;
}

.contact-item:hover {
  background-color: #f5f5f5;
}

.contact-item.active {
  background-color: #e3f2fd;
}

.new-chat {
  display: flex;
  gap: 5px;
}

.new-chat input {
  flex-grow: 1;
}
</style>