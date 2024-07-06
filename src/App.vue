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
            <!-- 여기에 더 많은 메뉴 항목들 추가 -->
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
import { ref, onMounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';
import axios from '@/plugins/axios'; // 새로 만든 Axios 인스턴스

const route = useRoute();
const router = useRouter();
const userId = ref(null);

const isActive = (path) => {
  return route.path === path;
};

const checkLogin = () => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    try {
      const decodedToken = jwt_decode(accessToken);
      userId.value = decodedToken.userId;
    } catch (error) {
      console.error('Failed to decode token', error);
    }
  }
};

const logout = async () => {
  try {
    await axios.post('/logout');

    // 로컬 스토리지에서 access 토큰 제거
    localStorage.removeItem('access');

    // refresh 토큰 쿠키 제거 (서버에서도 제거해야 함)
    document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // userId 초기화
    userId.value = null;

    // 홈 페이지로 리다이렉트
    router.push('/');
  } catch (error) {
    console.error('Logout failed', error);
  }
};

onMounted(() => {
  checkLogin();
});

// provide userId globally
provide('userId', userId);
</script>

<style>
.nav-link.active {
  font-weight: bold;
  color: #007bff; /* 원하는 강조 색상 */
}
</style>
