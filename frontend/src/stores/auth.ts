import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      axios.post('/api/authenticate', {
        username: username,
        password: password
      }).then((res) => {
        console.log("auth", res)
        this.user = res.data.data
        localStorage.setItem('user', JSON.stringify(this.user));
        router.push(this.returnUrl || '/dashboard/default');
      });
      // const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
      // this.user = user;
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/auth/login');
    }
  }
});
