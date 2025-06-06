import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IBtnVariant } from '@/types/IBtnVariant';

import AppToaster from './AppToaster';
import BottomSheetModal from './BottomSheetModal';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
	isVisible: boolean;
	onClose: () => void;
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;

	confirmBtnText?: string;
	confirmBtnVariant?: IBtnVariant;
	isConfirmLoading?: boolean;
	cancelBtnText?: string;
	cancelBtnVariant?: IBtnVariant;
	isCancelLoading?: boolean;
};

const ConfirmationModal = ({
	isVisible,
	onClose,
	title,
	description,
	onConfirm,
	onCancel = onClose,

	confirmBtnText = 'Confirm',
	confirmBtnVariant = 'primary',
	isConfirmLoading,
	cancelBtnText = 'Cancel',
	cancelBtnVariant = 'secondary',
	isCancelLoading,
}: Props) => {
	return (
		<BottomSheetModal isVisible={isVisible} onClose={onClose}>
			<ThemedView style={styles.innerContainer}>
				<ThemedText type="title2" style={styles.title}>
					{title}
				</ThemedText>

				<ThemedText style={styles.description}>
					{description}
				</ThemedText>

				<View style={styles.btnsContainer}>
					<ThemedButton
						label={cancelBtnText}
						variant={cancelBtnVariant}
						onPress={onCancel}
						loading={isCancelLoading}
						style={{ flex: 1 }}
					/>
					<ThemedButton
						label={confirmBtnText}
						variant={confirmBtnVariant}
						onPress={onConfirm}
						loading={isConfirmLoading}
						style={{ flex: 1 }}
					/>
				</View>
			</ThemedView>

			<AppToaster />
		</BottomSheetModal>
	);
};

export default ConfirmationModal;

const styles = StyleSheet.create({
	modal: {
		margin: 0,
	},
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 20,
	},
	innerContainer: {
		minWidth: 300,
		padding: 25,
		borderRadius: 12,
		gap: 20,
	},
	title: {
		textAlign: 'center',
	},
	description: {
		textAlign: 'center',
		opacity: 0.7,
	},
	btnsContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 10,
	},
});
