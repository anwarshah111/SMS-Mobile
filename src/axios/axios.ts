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
    const studentToken = await AsyncStorage.getItem('@STUDENT_TOKEN');
    const schoolToken = await AsyncStorage.getItem('@SCHOOOL_TOKEN');
    if (studentToken) {
      config.headers.Authorization = `${studentToken}`;
    } else if (schoolToken) {
      config.headers.Authorization = `${schoolToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
