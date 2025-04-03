import { AuthProvider } from 'react-admin';
import axios from 'axios';
import Cookies from 'js-cookie';
const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', { email, password }, { withCredentials: true });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error('Invalid credentials'));
        }
    },

    checkError: () => Promise.resolve(),

    checkAuth: () => {
        return Cookies.get('accessToken') ? Promise.resolve() : Promise.reject();
    },

    logout: () => {
        Cookies.remove('accessToken');
        return Promise.resolve();
    },

    getIdentity: () => Promise.resolve({ id: 'user', fullName: 'Admin' }),

    getPermissions: () => Promise.resolve(''),
};

export default authProvider;
