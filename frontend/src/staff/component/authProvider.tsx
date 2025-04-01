import { AuthProvider } from 'react-admin';
import axios from 'axios';

const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', { email, password }, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.data.accesstoken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error('Invalid credentials'));
        }
    },

    checkError: () => Promise.resolve(),

    checkAuth: () => {
        return localStorage.getItem('accessToken') ? Promise.resolve() : Promise.reject();
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.resolve();
    },

    getIdentity: () => Promise.resolve({ id: 'user', fullName: 'Admin' }),

    getPermissions: () => Promise.resolve(''),
};

export default authProvider;
