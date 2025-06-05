import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Providers from '@/components/global/Providers';

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	if (!loaded) {
		// Async font loading only occurs in development.
		return null;
	}

	return (
		<Providers>
			<Stack>
				<Stack.Screen name="login" options={{ headerShown: false }} />
				<Stack.Screen name="main" options={{ headerShown: false }} />
				<Stack.Screen
					name="post-detail"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="auto" />
		</Providers>
	);
}
