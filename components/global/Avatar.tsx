import { ThemedText } from '@/components/global/ThemedText';
import type React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
	uri?: string;
	name: string;
	size?: number;
};

const Avatar = ({ uri, name, size = 40 }: Props) => {
	const initials = name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.substring(0, 2);

	const getRandomColor = (name: string) => {
		const colors = [
			'#FF6B6B',
			'#4ECDC4',
			'#45B7D1',
			'#FFA5A5',
			'#A5DFDF',
			'#FFBE76',
			'#55E6C1',
			'#786FA6',
		];

		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		return colors[Math.abs(hash) % colors.length];
	};

	return (
		<View>
			{uri ? (
				<Image
					source={{ uri }}
					style={[
						styles.avatar,
						{ width: size, height: size, borderRadius: size / 2 },
					]}
				/>
			) : (
				<View
					style={[
						styles.placeholder,
						{
							width: size,
							height: size,
							borderRadius: size / 2,
							backgroundColor: getRandomColor(name),
						},
					]}
				>
					<ThemedText
						style={[styles.initials, { fontSize: size * 0.4 }]}
					>
						{initials}
					</ThemedText>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	avatar: {
		backgroundColor: '#E1E1E1',
	},
	placeholder: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	initials: {
		color: 'white',
		fontWeight: 'bold',
	},
});

export default Avatar;
