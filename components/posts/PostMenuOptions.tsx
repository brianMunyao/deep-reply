import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BottomSheetModal from '../global/BottomSheetModal';
import { ThemedText } from '../global/ThemedText';

import toastService from '@/services/global/toastService';
import postsService from '@/services/posts/postsService';
import { useAppDispatch } from '@/store/hooks';
import { removePost } from '@/store/slices/postsSlice';
import { IPost } from '@/types/IPost';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationModal from '../global/ConfirmationModal';

type Props = {
	visible: boolean;
	onClose: () => void;
	post?: IPost | null;
};

const PostMenuOptions = ({ visible, onClose, post }: Props) => {
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const dispatch = useAppDispatch();

	const deletePost = async () => {
		if (post) {
			postsService
				.deletePost(post.id)
				.then((res) => {
					dispatch(removePost(post.id));
					toastService.success('Post deleted');
				})
				.catch(() => {
					toastService.error('Error deleting post');
				})
				.finally(() => setIsConfirmationOpen(false));
		}
	};

	return (
		<>
			<BottomSheetModal
				title="Post Options"
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
				onConfirm={deletePost}
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

export default PostMenuOptions;
