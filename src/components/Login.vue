<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="login">

      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input class="form-control" id="floatingInput" placeholder="name@example.com" v-model="username">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      
      <div>
        <div id = "naver_id_login"></div>
      </div>

      <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
  </main>

  <div>
    <button class="btn btn-primary w-10 py-2" type="button" @click="kakaoLogin">kakao</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios'; // axios 인스턴스 import
import { onMounted } from 'vue';


const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
// const naverlogin = async() =>{
//       let client_id = "본인 client_id"
//       let redirect_uri = encodeURIComponent("redirct_url", "UTF-8")
//       const state = this.generateRandomState()
//       // const apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code"
//       //   + "&client_id=" + client_id
//       //   + "&redirect_uri=" + redirect_uri
//       //   + "&state=" + state
//       window.location.href = apiURL
//     };
const kakaoLogin = async() =>{
  const response = await axios.get('http://localhost:8088/login/kakao');
  const loginUrl = response.data; 
  // URL로 이동
  window.location.href = loginUrl;
}

onMounted(() => {
  const naverLogin = new window.naver_id_login(
    clientId,
    "http://localhost:5173/Naverlogin"  // 개발자센터에서 등록한 Callback URL
  );
  const state = naverLogin.getUniqState();
  naverLogin.setButton("white", 2, 40); // 버튼설정
  naverLogin.setDomain("http://localhost:5173");
  naverLogin.setState(state);
  // naverLogin.setPopup(); // 팝업 여부
  naverLogin.init_naver_id_login();
});

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const formData = new FormData();
    formData.append('username', username.value);
    formData.append('password', password.value);

    const response = await axios.post('/login', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // access 토큰 처리
    const accessToken = response.headers['access'];
    if (!accessToken) {
      throw new Error('Access token not found in response headers');
    }

    localStorage.setItem('access', accessToken);

    // refresh 토큰 처리
    const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh='))
        ?.split('=')[1];

    if (refreshToken) {

      // refresh 토큰 만료 설정
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 5);
      document.cookie = `refresh=${refreshToken}; path=/; expires=${expireDate.toUTCString()}; SameSite=Lax; `;
    } else {
      console.error('Refresh token not found in cookies');
    }

    // 홈 페이지로 리다이렉트
    router.push('/');
  } catch (error) {
    console.error('Login failed', error);
    // 여기에 에러 처리 로직 추가 (예: 사용자에게 알림)
  }
};
</script>

<style scoped>
</style>
