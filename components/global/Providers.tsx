import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';

import { store } from '@/store/store';
import AppToaster from './AppToaster';

type Props = PropsWithChildren<object>;

const Providers = ({ children }: Props) => {
	const colorScheme = useColorScheme();

	return (
		<AuthProvider>
			<ThemeProvider
				value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
			>
				<Provider store={store}>
					{children}
					<AppToaster />
				</Provider>
			</ThemeProvider>
		</AuthProvider>
	);
};

export default Providers;
