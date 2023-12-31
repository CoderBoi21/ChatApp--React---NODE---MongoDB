import axios from 'axios';
// config
import { BASE_URL } from '../config';
//BASE_URL => http://localhost:3001

const axiosInstance = axios.create({ baseURL: BASE_URL });

//It means middlewar
axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);
export default axiosInstance;