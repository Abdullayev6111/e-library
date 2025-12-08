import axios from 'axios';

const API = axios.create({
  baseURL: 'https://org-ave-jimmy-learners.trycloudflare.com',
});

export default API;
