import { StyleSheet } from 'react-native';

import ThemedSafeAreaView from '@/components/global/ThemedSafeAreaView';
import { ThemedText } from '@/components/global/ThemedText';
import { ThemedView } from '@/components/global/ThemedView';

export default function HomeScreen() {
	return (
		<ThemedSafeAreaView>
			<ThemedView>
				<ThemedText type="title">Welcome!</ThemedText>
			</ThemedView>
		</ThemedSafeAreaView>
	);
}

const styles = StyleSheet.create({});
