import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';

import AppToaster from './AppToaster';

type Props = PropsWithChildren<object>;

const Providers = ({ children }: Props) => {
	const colorScheme = useColorScheme();

	return (
		<AuthProvider>
			<ThemeProvider
				value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
			>
				{children}
				<AppToaster />
			</ThemeProvider>
		</AuthProvider>
	);
};

export default Providers;
