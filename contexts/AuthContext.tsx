import LocalStorageKeys from '@/constants/LocalStorageKeys';
import { fetchProfileService } from '@/services/auth/fetchProfileService';
import { loginService } from '@/services/auth/loginService';
import storageService from '@/services/global/storageService';
import { IUser } from '@/types/IUser';
import { router } from 'expo-router';
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

interface AuthContextType {
	isLoading: boolean;
	user: IUser | null;
	login: (user_handle: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		const loadToken = async () => {
			const storedToken = await storageService.getItem(
				LocalStorageKeys.TOKEN_KEY
			);
			if (storedToken) {
				await fetchProfile(storedToken);
			} else {
				router.navigate('/login');
			}
		};

		loadToken().finally(() => setIsLoading(false));
	}, []);

	const login = async (user_handle: string, password: string) => {
		try {
			const { authToken } = await loginService({ user_handle, password });

			await storageService.setItem(LocalStorageKeys.TOKEN_KEY, authToken);
			fetchProfile(authToken);
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	};

	const fetchProfile = async (authToken: string) => {
		try {
			const res = await fetchProfileService();
			setUser(res.data);
		} catch (error) {
			console.error('Fetching profile failed:', error);
			throw error;
		}
	};

	const logout = async () => {
		setUser(null);
		await storageService.removeItem(LocalStorageKeys.TOKEN_KEY);
		router.navigate('/main');
	};

	return (
		<AuthContext.Provider value={{ isLoading, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
