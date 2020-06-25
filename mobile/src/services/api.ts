import Axios from 'axios';

const api = Axios.create({
  baseURL: 'https://61f8819d64cb.ngrok.io',
});

export default api;
