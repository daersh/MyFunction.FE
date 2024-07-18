<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">MyFunctions</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: isActive('/') }" aria-current="page" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: isActive('/NotionPages') }" to="/NotionPages">Projects</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: isActive('/Chat') }" to="/Chat">Chat</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: isActive('/Map') }" to="/Map">Map</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: isActive('/NaverLoginEnter') }" to="/NaverLoginEnter">NaverLogin</router-link>
            </li>
          </ul>

          <div class="d-flex">
            <div v-if="userId" class="nav-item d-flex align-items-center">
              <span class="nav-link me-3">UserId: {{ userId }}</span>
              <button @click="logout" class="btn btn-outline-danger">Logout</button>
            </div>
            <div v-else class="nav-item">
              <router-link class="nav-link" :class="{ active: isActive('/login') }" to="/login">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <router-view></router-view>
</template>


<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';
import axios from '@/plugins/axios';

const route = useRoute();
const router = useRouter();
const userId = ref(null);

const isActive = (path) => {
  return route.path === path;
};

const getRefreshToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('refresh='))?.split('=')[1];
};

const setRefreshToken = (token) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30); // 30일 후 만료
  document.cookie = `refresh=${token}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax; HttpOnly; `;
};

const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    handleAuthError(); // refreshToken이 없으면 에러 처리
    return;
  }

  try {
    const response = await axios.post('/reissue', { refresh }, {
      withCredentials: true
    });
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    localStorage.setItem('access', newAccessToken);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    const decodedToken = jwt_decode(newAccessToken);
    userId.value = decodedToken.userId; // userId 업데이트
  } catch (error) {
    console.error('Failed to refresh token', error);
    handleAuthError();
  }
};


const checkLogin = async () => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    try {
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 > Date.now()) {
        userId.value = decodedToken.userId;
      } else {
        await refreshToken(); // 토큰이 만료된 경우에만 refreshToken 호출
      }
    } catch (error) {
      console.error('Failed to decode token', error);
      handleAuthError();
    }
  } else {
    const refresh = getRefreshToken();
    if (refresh) {
      await refreshToken(); // 로컬 스토리지에 accessToken이 없고, refreshToken이 있는 경우에 refreshToken 호출
    } else {
      handleAuthError();
    }
  }
};


const logout = async () => {
  try {
    await axios.post('/logout');
    localStorage.removeItem('access');
    document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; HttpOnly; ';
    userId.value = null;
    router.push('/');
  } catch (error) {
    console.error('Logout failed', error);
  }
};

const handleAuthError = () => {
  userId.value = null;
  localStorage.removeItem('access');
  document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; HttpOnly; ';
  router.push('/login');
};

let refreshInterval;

onMounted(async () => {
  await checkLogin();
  refreshInterval = setInterval(checkLogin, 5 * 60 * 1000); // 5분마다 체크
});

onUnmounted(() => {
  clearInterval(refreshInterval);
});

provide('userId', userId);

</script>

<style>
.nav-link.active {
  font-weight: bold;
  color: #007bff;
}
</style>