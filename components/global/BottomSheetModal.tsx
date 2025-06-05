import React from 'react';
import {
	KeyboardAvoidingView,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
	isVisible?: boolean;
	onClose?: () => void;
	title?: string;
	children?: React.ReactNode;
	showCloseButton?: boolean;
	hasInnerPadding?: boolean;
	containerStyle?: ViewStyle;
};

const BottomSheetModal = ({
	isVisible,
	onClose,
	title,
	children,
	showCloseButton = true,
	hasInnerPadding = true,
	containerStyle = {},
}: Props) => {
	const cardBackgroundColor = useThemeColor({}, 'cardBackground');
	const textColor = useThemeColor({}, 'text');

	return (
		<View>
			<Modal
				isVisible={isVisible}
				onBackdropPress={onClose}
				onBackButtonPress={onClose}
				statusBarTranslucent
				useNativeDriver={false}
				style={styles.modal}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				backdropTransitionInTiming={1}
				backdropTransitionOutTiming={1}
				avoidKeyboard
			>
				<KeyboardAvoidingView behavior="padding">
					<ThemedView
						style={[
							styles.container,
							{
								padding: hasInnerPadding ? 15 : 0,
							},
							containerStyle,
						]}
					>
						{(title || showCloseButton) && (
							<View
								style={[
									styles.header,
									{
										paddingHorizontal: hasInnerPadding
											? 0
											: 15,
										paddingTop: hasInnerPadding ? 0 : 15,
									},
								]}
							>
								{title ? (
									<ThemedText type="title3">
										{title}
									</ThemedText>
								) : (
									<View />
								)}

								{showCloseButton && (
									<TouchableOpacity
										style={[
											styles.closeButton,
											{
												backgroundColor:
													cardBackgroundColor,
											},
										]}
										onPress={onClose}
										activeOpacity={0.7}
									>
										<Ionicons
											name="close"
											size={20}
											color={textColor}
										/>
									</TouchableOpacity>
								)}
							</View>
						)}

						{children}
					</ThemedView>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	container: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	closeButton: {
		padding: 4,
		borderRadius: 20,
	},
	closeButtonText: {
		fontSize: 20,
		color: '#999',
	},
});

export default BottomSheetModal;
