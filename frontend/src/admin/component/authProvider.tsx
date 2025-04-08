import { AuthProvider } from 'react-admin';
import axios from 'axios';
const User = localStorage.getItem('user');
const parsedUser = User ? JSON.parse(User) : null;
const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/login',
        { email, password },
        { withCredentials: true }
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error('Invalid credentials'));
    }
  },

  checkError: () => Promise.resolve(),

  checkAuth: () => {
    return localStorage.getItem('user') ? Promise.resolve() : Promise.reject();
  },

  logout: () => {
    axios.get('http://localhost:8080/api/user/logout', {
      data: { userid: parsedUser?._id },
      withCredentials: true,
    });
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getIdentity: () => Promise.resolve({ id: parsedUser?._id, fullName: parsedUser?.name }),

  getPermissions: () => Promise.resolve(''),
};

export default authProvider;
