import { ThemedText } from '@/components/global/ThemedText';
import { ThemedTextInput } from '@/components/global/ThemedTextInput';
import { ThemedView } from '@/components/global/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import toastService from '@/services/global/toastService';
import postsService, { COMMUNITY_ID } from '@/services/posts/postsService';
import { IPostNew } from '@/types/IPost';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import BottomSheetModal from '../global/BottomSheetModal';
import { ThemedButton } from '../global/ThemedButton';

interface Props {
	visible: boolean;
	onClose: () => void;
	onPostCreated: () => void;
}

const CreatePostModal: React.FC<Props> = ({
	visible,
	onClose,
	onPostCreated,
}) => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [link, setLink] = useState('');
	const [loading, setLoading] = useState(false);

	const slideAnim = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;

	const backgroundColor = useThemeColor({}, 'background');
	const borderColor = useThemeColor({}, 'separator');
	const mutedColor = useThemeColor({}, 'secondary');

	// Validation
	const isFormValid = useMemo(() => {
		const hasTitle = title.trim().length > 0;
		const hasContent = content.trim().length > 0;

		return hasTitle && hasContent;
	}, [title, content]);

	const characterCount = useMemo(() => {
		return title.length + content.length;
	}, [title, content]);

	React.useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			slideAnim.setValue(0);
			fadeAnim.setValue(0);
		}
	}, [visible]);

	// Reset form when modal closes
	React.useEffect(() => {
		if (!visible) {
			setTitle('');
			setContent('');
			setLink('');
		}
	}, [visible]);

	const handleCreatePost = async () => {
		if (!isFormValid) {
			toastService.error('Please fill in all required fields');
			return;
		}

		if (characterCount > 2000) {
			toastService.error('Post is too long (max 2000 characters)');
			return;
		}

		setLoading(true);
		try {
			const mentionedUsers = extractMentions(content);

			const postData: IPostNew = {
				community_id: COMMUNITY_ID,
				title: title.trim(),
				content: content.trim(),
				content_type: '',
				link: link.trim() || '',
				mentioned_users: mentionedUsers,
				poll_options: [],
				date_poll_end: 0,
				reposted_posts_id: '',
				video_metadata: {},
				gifs: [],
				images: [],
				video_file_url: [],
			};

			await postsService.createPost(postData);

			onPostCreated();
			onClose();

			toastService.success('Post created successfully!');
		} catch (error) {
			console.error('Failed to create post:', error);
			toastService.error('Failed to create post. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const extractMentions = (text: string): string[] => {
		const mentionRegex = /@(\w+)/g;
		const mentions: string[] = [];
		let match;
		while ((match = mentionRegex.exec(text)) !== null) {
			mentions.push(match[1]);
		}
		return mentions;
	};

	return (
		<BottomSheetModal
			title="Create Post"
			isVisible={visible}
			onClose={onClose}
		>
			<ThemedView style={[styles.container, { backgroundColor }]}>
				{/* {renderHeader()} */}

				<ThemedView style={styles.form}>
					<ThemedView style={styles.inputGroup}>
						<ThemedText style={styles.label}>Title *</ThemedText>
						<ThemedTextInput
							style={[styles.input, { borderColor }]}
							placeholder="Enter an engaging title..."
							value={title}
							onChangeText={setTitle}
							maxLength={200}
						/>
					</ThemedView>

					<ThemedView style={styles.inputGroup}>
						<ThemedText style={styles.label}>Content *</ThemedText>
						<ThemedTextInput
							style={[
								styles.input,
								styles.contentInput,
								{ borderColor },
							]}
							placeholder="Share your thoughts..."
							value={content}
							onChangeText={setContent}
							multiline
							numberOfLines={6}
							textAlignVertical="top"
							maxLength={1800}
						/>
					</ThemedView>

					<View style={styles.statsContainer}>
						<ThemedText
							style={[
								styles.statsText,
								{
									color:
										characterCount > 2000
											? '#FF4444'
											: mutedColor,
								},
							]}
						>
							Total characters: {characterCount}/2000
						</ThemedText>
					</View>
				</ThemedView>

				<ThemedButton
					label="Post"
					loading={loading}
					onPress={handleCreatePost}
					disabled={!isFormValid}
				>
					Post
				</ThemedButton>
			</ThemedView>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		margin: 0,
	},
	container: {
		// flex: 1,
		paddingBottom: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	closeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontWeight: '600',
	},
	draftButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		minWidth: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	draftButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	form: {
		paddingVertical: 20,
		gap: 24,
	},
	contentTypeSelector: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 8,
	},
	contentTypeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		gap: 6,
	},
	contentTypeText: {
		fontSize: 12,
		fontWeight: '500',
	},
	inputGroup: {
		gap: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
	},
	input: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 16,
	},
	contentInput: {
		minHeight: 120,
		maxHeight: 200,
	},
	characterCounter: {
		fontSize: 12,
		textAlign: 'right',
		opacity: 0.6,
	},
	mediaSection: {
		gap: 12,
	},
	mediaSectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
	},
	uploadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 8,
	},
	uploadingText: {
		fontSize: 14,
		opacity: 0.7,
	},
	statsContainer: {
		alignItems: 'center',
		paddingVertical: 8,
	},
	statsText: {
		fontSize: 12,
	},
});

export default CreatePostModal;
