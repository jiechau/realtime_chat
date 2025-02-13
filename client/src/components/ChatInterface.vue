<template>
  <div class="chat-container">
    <ContactList 
      :contacts="contacts"
      :selectedContact="selectedContact"
      @select-contact="selectContact"
      @new-chat="startNewChat"
    />
    <ChatWindow 
      v-if="selectedContact"
      :messages="messages"
      :currentUser="userId"
      :contact="selectedContact"
      :isVendor="isVendor"
      @send-message="sendMessage"
    />
    <div v-else class="no-chat-selected">
      Select a contact or start a new chat
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import io from 'socket.io-client';
import axios from 'axios';
import ContactList from './ContactList.vue';
import ChatWindow from './ChatWindow.vue';

export default {
  components: {
    ContactList,
    ChatWindow
  },
  setup() {
    const store = useStore();
    //const socket = io('http://172.26.8.103:3000');
    //const socket = io('http://localhost:3000');
    const socket = io('http://' + window.location.hostname + ':3000');
    const contacts = ref([]);
    const selectedContact = ref(null);
    const messages = ref([]);
    const userId = store.state.userId;
    const isVendor = store.state.isVendor;

    const loadContacts = async () => {
      try {
        const response = await axios.get(
          //`http://http://172.26.8.103:3000/api/contacts/${userId}/${isVendor}`
          //`http://localhost:3000/api/contacts/${userId}/${isVendor}`
          `http://${window.location.hostname}:3000/api/contacts/${userId}/${isVendor}`
        );
        contacts.value = response.data;
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    };

    const loadMessages = async (contactId) => {
      try {
        const response = await axios.get(
          //`http://172.26.8.103:3000/api/messages/${userId}/${contactId}`
          //`http://localhost:3000/api/messages/${userId}/${contactId}`
          `http://${window.location.hostname}:3000/api/messages/${userId}/${contactId}`
        );
        messages.value = response.data;
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    const selectContact = async (contactId) => {
      selectedContact.value = contactId;
      await loadMessages(contactId);
    };

    const startNewChat = (contactId) => {
      if (!contacts.value.includes(contactId)) {
        contacts.value.push(contactId);
      }
      selectContact(contactId);
    };

    const sendMessage = async (content) => {
      const messageData = {
        senderId: userId,
        receiverId: selectedContact.value,
        content,
        isVendor
      };

      socket.emit('send_message', messageData);
      messages.value.push({
        ...messageData,
        timestamp: new Date()
      });
    };

    onMounted(() => {
      socket.emit('join', { userId, isVendor });
      loadContacts();

      socket.on('receive_message', (message) => {
        if (selectedContact.value === message.senderId) {
          messages.value.push(message);
        }
        if (!contacts.value.includes(message.senderId)) {
          contacts.value.push(message.senderId);
        }
      });
    });

    return {
      contacts,
      selectedContact,
      messages,
      userId,
      isVendor,
      selectContact,
      startNewChat,
      sendMessage
    };
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
}

.no-chat-selected {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  color: #666;
}
</style>
