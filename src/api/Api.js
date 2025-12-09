import axios from 'axios';

const API = axios.create({
  baseURL: 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1',
});

export default API;
