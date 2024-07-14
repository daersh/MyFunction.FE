<template>
  <div class="container">
    <div class="chat-window">
      <div class="chat-header">
        <h3>실시간 채팅</h3>
      </div>
      <div class="chat-messages" ref="chatMessages">
        <div v-for="message in messages" :key="message.id" class="message">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
          <small>{{ new Date(message.timestamp).toLocaleString() }}</small>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" type="text" class="form-control" placeholder="메시지를 입력하세요...">
        <button @click="sendMessage" class="btn btn-primary">보내기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { Client } from '@stomp/stompjs';
import axios from '@/plugins/axios'; // 새로 만든 Axios 인스턴스 import

const messages = ref([]);
const newMessage = ref('');
const username = ref('admin'); // 사용자명은 필요에 따라 변경

const connectWebSocket = () => {
  const client = new Client({
    brokerURL: 'ws://port-0-myfunction-ly3nu14643e28c63.sel5.cloudtype.app/ws',
    connectHeaders: {
      'access': localStorage.getItem('access')  // JWT 토큰 추가
    },
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.onConnect = function (frame) {
    console.log('Connected: ' + frame);
    client.subscribe('/topic/messages', function (message) {
      const receivedMessage = JSON.parse(message.body);
      messages.value.push(receivedMessage);
      scrollToBottom();
    });
  };

  client.onStompError = function (frame) {
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
  };

  client.activate();

  return client;
};

let stompClient = null;

onMounted(() => {
  stompClient = connectWebSocket();
});

const sendMessage = () => {
  if (newMessage.value.trim() !== '' && stompClient && stompClient.connected) {
    const chatMessage = {
      sender: username.value,
      content: newMessage.value,
      timestamp: new Date().toISOString()
    };
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage)
    });
    newMessage.value = '';
  } else if (!stompClient || !stompClient.connected) {
    Swal.fire('Error', 'WebSocket 연결이 끊어졌습니다. 페이지를 새로고침 해주세요.', 'error');
  } else {
    Swal.fire('Error', '메시지를 입력하세요.', 'error');
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
};

const loadMessagesFromServer = async () => {
  try {
    const response = await axios.get('/messages'); // 수정 필요: 실제 서버에서 메시지를 가져오는 API 엔드포인트로 변경
    messages.value = response.data;
    
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load messages:', error);
    Swal.fire('Error', '채팅 메시지를 불러오는데 실패했습니다.', 'error');
  }
};
loadMessagesFromServer(); // ���기 메시지 로드
</script>

<style>
.chat-window {
  max-width: 600px;
  margin: 50px auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.chat-header {
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
}
.chat-messages {
  height: 400px;
  padding: 10px;
  overflow-y: scroll;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.chat-input {
  display: flex;
  padding: 10px;
}
.chat-input input {
  flex: 1;
  margin-right: 10px;
}
.message {
  margin-bottom: 10px;
}
</style>
