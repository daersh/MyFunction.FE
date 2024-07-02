import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://port-0-myfunction-ly3nu14643e28c63.sel5.cloudtype.app',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
