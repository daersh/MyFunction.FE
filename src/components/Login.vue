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
      <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios'; // axios 인스턴스 import

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
    console.log('Access Token:', accessToken);
    localStorage.setItem('access', accessToken);

    // refresh 토큰 처리
    const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh='))
        ?.split('=')[1];

    if (refreshToken) {
      console.log('Refresh Token:', refreshToken);
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
