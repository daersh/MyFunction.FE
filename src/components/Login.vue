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

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const formData = new FormData();
    formData.append('username', username.value);
    formData.append('password', password.value);

    const response = await fetch('https://port-0-myfunction-ly3nu14643e28c63.sel5.cloudtype.app/login', {
      method: 'POST',
      body: formData,
      credentials: 'include' // 이 옵션을 추가하여 쿠키를 자동으로 처리하도록 합니다.
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    // 헤더에서 access 토큰 가져오기
    const accessToken = response.headers.get('access');

    if (!accessToken) {
      throw new Error('Access token not found in response headers');
    }

    console.log('Access Token:', accessToken);

    // access 토큰을 로컬 스토리지에 저장
    localStorage.setItem('access', accessToken);

    // 쿠키에서 refresh 토큰을 가져와서 설정
    const cookies = document.cookie.split('; ');
    let refreshToken = '';
    const expireDate = new Date();  // 만료 시간을 현재 시간으로 설정
    expireDate.setDate(expireDate.getDate() + 7); // 예시: 7일 후에 만료되도록 설정
    const expireDateString = expireDate.toUTCString(); // UTC 문자열로 변환

    cookies.forEach(cookie => {
      const [name, value] = cookie.split('=');
      if (name.trim() === 'refresh') { // name.trim()으로 공백을 제거한 후 비교
        refreshToken = value;
        document.cookie = `refresh=${refreshToken}; path=/; expires=${expireDateString}; SameSite=None; Secure`;
      }
    });


    if (refreshToken) {
      console.log('Refresh Token:', refreshToken);
      // 여기서 로컬 스토리지에 저장하거나 다른 작업을 수행할 수 있습니다.
    } else {
      console.error('Refresh token not found in cookies');
    }

    // 홈 페이지로 리다이렉트
    router.push('/');
  } catch (error) {
    console.error('Login failed', error);
  }
};
</script>

<style scoped>
</style>
