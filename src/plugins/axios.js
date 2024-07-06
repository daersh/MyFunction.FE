import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://port-0-myfunction-ly3nu14643e28c63.sel5.cloudtype.app',
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

export default axiosInstance;
