import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'https://port-0-myfunction-ly3nu14643e28c63.sel5.cloudtype.app',
    // baseURL: 'http://localhost:8010',
    withCredentials: true,
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        config.headers['access'] = accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        // 여기서 refresh 토큰을 확인하고 필요하다면 저장
        const refreshToken = response.headers['refresh-token']; // 서버 응답 헤더에 따라 조정
        if (refreshToken) {
            // refresh 토큰을 쿠키에 저장
            document.cookie = `refresh=${refreshToken}; path=/; Secure; SameSite=Lax`;
        }
        return response;
    },
    async (error) => {
        // 여기서 토큰 만료 등의 에러를 처리
        if (error.response.status === 401) {
            // refresh 토큰을 사용하여 새 access 토큰 요청
            // ...
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
