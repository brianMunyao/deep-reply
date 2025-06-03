import AsyncStorage from '@react-native-async-storage/async-storage';

const storageService = {
	setItem: async (key: string, value: any): Promise<void> => {
		try {
			const stringValue =
				typeof value === 'string' ? value : JSON.stringify(value);
			await AsyncStorage.setItem(key, stringValue);
		} catch (error) {
			console.error(`Error setting item with key "${key}":`, error);
		}
	},

	getItem: async <T = any>(key: string): Promise<T | null> => {
		try {
			const value = await AsyncStorage.getItem(key);
			return value ? (JSON.parse(value) as T) : null;
		} catch (error) {
			console.error(`Error getting item with key "${key}":`, error);
			return null;
		}
	},

	removeItem: async (key: string): Promise<void> => {
		try {
			await AsyncStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing item with key "${key}":`, error);
		}
	},

	clearAll: async (): Promise<void> => {
		try {
			await AsyncStorage.clear();
		} catch (error) {
			console.error('Error clearing AsyncStorage:', error);
		}
	},
};

export default storageService;
