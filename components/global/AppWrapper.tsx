import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { PropsWithChildren } from 'react';
import { ActivityIndicator } from 'react-native';
import ThemedSafeAreaView from './ThemedSafeAreaView';

type Props = PropsWithChildren<object>;

const AppWrapper = ({ children }: Props) => {
	const { isLoading } = useAuth();
	const color = useThemeColor({}, 'inputTextPlaceholder');

	return (
		<ThemedSafeAreaView
			style={{ alignItems: 'center', justifyContent: 'center' }}
		>
			{isLoading ? (
				<ActivityIndicator color={color} size="large" />
			) : (
				children
			)}
		</ThemedSafeAreaView>
	);
};

export default AppWrapper;
