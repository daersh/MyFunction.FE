<template>
  <div>
    <h2>Naver Login Callback</h2>
    <div>
      <p>Email: {{ email }}</p>
      <p>Nickname: {{ nickname }}</p>
    </div>
    <button type="button" @click="logout">로그아웃</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// 네이버 개발자센터에서 어플리케이션 등록 시 발급된 값
const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NAVER_SECRET;

const email = ref('');
const nickname = ref('');
const accessToken = ref('');
const router = useRouter();

const userInfo = async () => {
  const url = `/v1/nid/me`;
  const headers = { Authorization: `Bearer ${accessToken.value}` };
  try {
    const { data } = await axios.get(url, { headers });
    console.log("userInfo: ", data);
    email.value = data.response.email; // 이메일
    nickname.value = data.response.nickname; // 별명
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};

const logout = async () => {
  const url = `/oauth2.0/token?grant_type=delete&client_id=${clientId}&client_secret=${clientSecret}&access_token=${accessToken.value}&service_provider=NAVER`;
  try {
    const { data } = await axios.get(url);
    console.log(data);
    router.push({ path: "/login" });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

onMounted(() => {
  const naverLogin = new window.naver_id_login(clientId);
  accessToken.value = naverLogin.oauthParams.access_token;
  userInfo();
});
</script>

<style scoped>
div {
  margin: 20px;
}
h2 {
  color: #4caf50;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
