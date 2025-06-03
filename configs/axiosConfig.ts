import axios from 'axios';

import LocalStorageKeys from '@/constants/LocalStorageKeys';
import storageService from '@/services/global/storageService';

const axiosClient = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
	timeout: 10000,
});

// interceptor to include the token in headers
axiosClient.interceptors.request.use(
	async (config) => {
		config.headers.set('X-Data-Source', 'staging');

		if (!config.url?.includes('login')) {
			const token = storageService.getItem(LocalStorageKeys.TOKEN_KEY);

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		return config;
	},
	(error) => Promise.reject(error)
);

// interceptor to centrally check unauthorized access
axiosClient.interceptors.response.use(
	async (response) => {
		if (response.status === 401) {
			storageService.removeItem(LocalStorageKeys.TOKEN_KEY);
		}

		return response;
	},
	(error) => {
		try {
			return Promise.reject(error);
		} catch (e) {
			return Promise.reject(error);
		}
	}
);

export default axiosClient;
