import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import {
	ActivityIndicator,
	Animated,
	GestureResponderEvent,
	StyleSheet,
	Text,
	TextStyle,
	TouchableNativeFeedback,
	TouchableNativeFeedbackProps,
	View,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { IBtnVariant } from '@/types/IBtnVariant';

export type Props = TouchableNativeFeedbackProps & {
	lightColor?: string;
	darkColor?: string;

	label: string;
	loading?: boolean;

	variant?: IBtnVariant;
	size?: 'small' | 'normal';
	textStyle?: TextStyle;
	startIcon?: string;
};

export function ThemedButton({
	style,
	lightColor,
	darkColor,
	label,
	loading,
	disabled = loading,
	variant = 'primary',
	size = 'normal',
	onPressIn,
	onPressOut,
	textStyle = {},
	startIcon,
	...otherProps
}: Props) {
	const buttonDisabledBackground = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'buttonDisabledBackground'
	);
	const buttonPrimaryBackground = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'buttonPrimaryBackground'
	);
	const dangerButtonBackground = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'dangerButtonBackground'
	);
	const successButtonBackground = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'successButtonBackground'
	);
	const secondaryBackgroundColor = useThemeColor({}, 'cardBackground');

	const scaleValue = useRef(new Animated.Value(1)).current;

	const handlePressIn = (event: GestureResponderEvent) => {
		Animated.spring(scaleValue, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();

		onPressIn?.(event);
	};

	const handlePressOut = (event: GestureResponderEvent) => {
		Animated.spring(scaleValue, {
			toValue: 1,
			useNativeDriver: true,
		}).start();

		onPressOut?.(event);
	};

	const getBtnBgColor = () => {
		if (disabled || loading) {
			return buttonDisabledBackground;
		}

		switch (variant) {
			case 'danger':
				return dangerButtonBackground;
			case 'success':
				return successButtonBackground;
			case 'secondary':
				return secondaryBackgroundColor;
			case 'primary':
			default:
				return buttonPrimaryBackground;
		}
	};
	const getBtnColor = () => {
		switch (variant) {
			case 'danger':
				return 'dangerButtonText';
			case 'success':
				return 'successButtonText';
			case 'secondary':
				return 'text';
			case 'primary':
			default:
				return 'buttonPrimaryText';
		}
	};

	const btnTextColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		getBtnColor()
	);

	const getSize = () => {
		switch (size) {
			case 'small':
				return { fontSize: 16, padding: 11 };
			case 'normal':
			default:
				return { fontSize: 18, padding: 11 };
		}
	};

	return (
		<TouchableNativeFeedback
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			{...otherProps}
		>
			<Animated.View
				style={[
					styles.container,
					{
						backgroundColor: getBtnBgColor(),
						padding: getSize().padding,
					},
					{ transform: [{ scale: scaleValue }] },
					style,
				]}
			>
				<View />

				{loading ? (
					<ActivityIndicator
						color={btnTextColor}
						style={{ height: 25 }}
					/>
				) : (
					<View style={styles.labelIconContainer}>
						{startIcon && (
							<Ionicons
								name={startIcon as any}
								size={getSize().fontSize}
								color={btnTextColor}
								style={textStyle}
							/>
						)}

						<Text
							style={[
								styles.label,
								{
									color: btnTextColor,
									fontSize: getSize().fontSize,
									...textStyle,
								},
							]}
						>
							{label}
						</Text>
					</View>
				)}

				<View />
			</Animated.View>
		</TouchableNativeFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	label: {
		fontWeight: 500,
		letterSpacing: 0.3,
		flexShrink: 1,
		fontFamily: 'Inter',
	},
	labelIconContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
});
