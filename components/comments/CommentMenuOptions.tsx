import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BottomSheetModal from '../global/BottomSheetModal';
import { ThemedText } from '../global/ThemedText';

import commentsService from '@/services/comments/commentsService';
import toastService from '@/services/global/toastService';
import { IComment } from '@/types/IComment';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationModal from '../global/ConfirmationModal';

type Props = {
	visible: boolean;
	onClose: () => void;
	comment?: IComment | null;
};

const CommentMenuOptions = ({ visible, onClose, comment }: Props) => {
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	const deleteComment = async () => {
		if (comment) {
			commentsService
				.deleteComment(comment.id)
				.then((res) => {
					toastService.success('Comment deleted');
				})
				.catch(() => {
					toastService.error('Error deleting comment');
				})
				.finally(() => setIsConfirmationOpen(false));
		}
	};

	return (
		<>
			<BottomSheetModal
				title="Comment Options"
				isVisible={visible}
				onClose={onClose}
				containerStyle={styles.container}
			>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						setIsConfirmationOpen(true);
						onClose();
					}}
				>
					<View style={styles.option}>
						<ThemedText style={styles.optionText}>
							<Ionicons name="trash" size={16} />
						</ThemedText>
						<ThemedText style={styles.optionText}>
							Delete
						</ThemedText>
					</View>
				</TouchableOpacity>
			</BottomSheetModal>

			<ConfirmationModal
				isVisible={isConfirmationOpen}
				title="Are you sure?"
				description=""
				confirmBtnText="Delete"
				onCancel={() => setIsConfirmationOpen(false)}
				onClose={() => setIsConfirmationOpen(false)}
				onConfirm={deleteComment}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		gap: 1,
	},
	option: {
		paddingVertical: 15,
		paddingHorizontal: 5,
		display: 'flex',
		flexDirection: 'row',
		gap: 5,
	},
	optionText: {
		fontSize: 18,
	},
});

export default CommentMenuOptions;
