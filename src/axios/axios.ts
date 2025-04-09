import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const ath_token = await AsyncStorage.getItem('@STUDENT_TOKEN');
    if (ath_token) {
      config.headers.Authorization = `${ath_token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
