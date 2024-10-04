import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string): Promise<void> {
      try {
        const res = await axios.post('/api/auth/login', {
          username: username,
          password: password
        });
    
        if (res.data.status === 'error') {
          return Promise.reject(res.data.message);
        }
    
        this.user = res.data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        router.push(this.returnUrl || '/dashboard/default');
      } catch (error) {
        return Promise.reject(error);
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/auth/login');
    }
  }
});
