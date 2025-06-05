import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/global/ThemedText';
import { ThemedView } from '@/components/global/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IComment } from '@/types/IComment';
import Avatar from '../global/Avatar';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface CommentItemProps {
	comment: IComment;
	onReply: (commentId: string) => void;
	onLike: (commentId: string) => void;
	isLastInThread?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	onReply,
	onLike,
	isLastInThread = false,
}) => {
	const cardBackground = useThemeColor({}, 'cardBackground');
	const textColor = useThemeColor({}, 'text');
	const mutedColor = useThemeColor({}, 'secondary');
	const borderColor = useThemeColor({}, 'separator');

	const [liked, setLiked] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const handleLike = () => {
		setLiked(!liked);
		onLike(comment.id);
	};

	const hasMedia =
		(comment?.images || []).length > 0 || (comment?.gifs || []).length > 0;
	const createdAt =
		typeof comment.created_at === 'string'
			? new Date(comment.created_at)
			: new Date(comment.created_at);

	const timeAgo = dayjs(createdAt).fromNow();

	return (
		<View
			style={[styles.container, { marginLeft: comment.depth_level * 16 }]}
		>
			<View style={styles.commentContainer}>
				<Avatar
					uri={comment.user_details.avatar}
					size={32}
					name={comment.user_details.display_name}
				/>

				<View style={styles.contentContainer}>
					<ThemedView
						style={[
							styles.bubble,
							{ backgroundColor: cardBackground },
						]}
					>
						<View style={styles.header}>
							<ThemedText style={styles.username}>
								{comment.user_details.display_name}
							</ThemedText>
							<ThemedText style={styles.handle}>
								@{comment.user_details.user_handle}
							</ThemedText>
						</View>

						<ThemedText style={styles.content}>
							{expanded
								? comment.content
								: comment.content.length > 150
								? `${comment.content.substring(0, 150)}...`
								: comment.content}
						</ThemedText>

						{comment.content.length > 150 && (
							<TouchableOpacity
								onPress={() => setExpanded(!expanded)}
							>
								<ThemedText style={styles.readMore}>
									{expanded ? 'Show less' : 'Read more'}
								</ThemedText>
							</TouchableOpacity>
						)}

						<ThemedText
							style={{ borderWidth: 1, borderColor: '#fff' }}
						>
							Here
							{JSON.stringify(comment?.gifs)}
							{JSON.stringify(comment?.images)}
						</ThemedText>

						{hasMedia && (
							<View style={styles.mediaContainer}>
								{/* {comment.images.map((img, index) => (
									<Image
										key={`img-${index}`}
										source={{ uri: img.url }}
										style={styles.media}
									/>
								))} */}
								{/* {comment.gifs.map((gif, index) => (
									<Image
										key={`gif-${index}`}
										source={{ uri: gif.url }}
										style={styles.media}
									/>
								))} */}
							</View>
						)}
					</ThemedView>

					<View style={styles.actions}>
						<ThemedText style={styles.timestamp}>
							{timeAgo}
						</ThemedText>

						<View style={styles.actionButtons}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleLike}
							>
								<Ionicons
									name="heart"
									size={14}
									color={liked ? '#FF4D4D' : mutedColor}
									fill={liked ? '#FF4D4D' : 'transparent'}
								/>
								{comment.score > 0 && (
									<ThemedText
										style={[
											styles.actionCount,
											liked && { color: '#FF4D4D' },
										]}
									>
										{comment.score}
									</ThemedText>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => onReply(comment.id)}
							>
								<Ionicons
									name="at-circle"
									size={14}
									color={mutedColor}
								/>
								{comment.child_count > 0 && (
									<ThemedText style={styles.actionCount}>
										{comment.child_count}
									</ThemedText>
								)}
							</TouchableOpacity>

							<TouchableOpacity style={styles.actionButton}>
								<Ionicons
									name="ellipsis-horizontal"
									size={14}
									color={mutedColor}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>

			{!isLastInThread && comment.depth_level > 0 && (
				<View
					style={[
						styles.threadLine,
						{
							left: (comment.depth_level - 1) * 16 + 16,
							borderColor: borderColor,
						},
					]}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginBottom: 12,
	},
	commentContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	contentContainer: {
		flex: 1,
		marginLeft: 8,
	},
	bubble: {
		padding: 12,
		borderRadius: 16,
		borderTopLeftRadius: 4,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	username: {
		fontWeight: '600',
		fontSize: 14,
		marginRight: 4,
	},
	handle: {
		fontSize: 12,
		color: '#666',
	},
	content: {
		fontSize: 14,
		lineHeight: 20,
	},
	readMore: {
		color: '#007AFF',
		fontSize: 13,
		marginTop: 4,
	},
	mediaContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 8,
	},
	media: {
		width: 80,
		height: 80,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 8,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 4,
		paddingHorizontal: 4,
	},
	timestamp: {
		fontSize: 12,
		color: '#666',
	},
	actionButtons: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 16,
		padding: 4,
	},
	actionCount: {
		fontSize: 12,
		color: '#666',
		marginLeft: 4,
	},
	threadLine: {
		position: 'absolute',
		left: 16,
		top: 40,
		bottom: 0,
		width: 1,
		borderLeftWidth: 1,
		borderStyle: 'dashed',
	},
});

export default CommentItem;
