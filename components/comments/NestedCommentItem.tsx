import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/global/ThemedText';
import { ThemedView } from '@/components/global/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IComment } from '@/types/IComment';

import Avatar from '../global/Avatar';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type Props = {
	comment: IComment;
	onReply: (comment: IComment) => void;
	onViewMoreReplies?: (commentId: string) => void;
	maxDepth?: number;
	showViewMoreButton?: boolean;
	isCollapsed?: boolean;
	onToggleCollapse?: (commentId: string) => void;
};

const NestedCommentItem = ({
	comment,
	onReply,
	onViewMoreReplies,
	maxDepth = 4,
	showViewMoreButton = false,
	isCollapsed = false,
	onToggleCollapse,
}: Props) => {
	const cardBackground = useThemeColor({}, 'cardBackground');
	const textColor = useThemeColor({}, 'text');
	const mutedColor = useThemeColor({}, 'secondary');
	const borderColor = useThemeColor({}, 'separator');

	const [liked, setLiked] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const handleLike = () => {
		setLiked(!liked);
	};

	const hasMedia =
		(comment?.images || []).filter((img) => Boolean(img)).length > 0 ||
		(comment?.gifs || []).filter((gif) => Boolean(gif)).length > 0;
	const createdAt =
		typeof comment.created_at === 'string'
			? new Date(comment.created_at)
			: new Date(comment.created_at);
	const timeAgo = dayjs(createdAt).fromNow();

	// Calculate indentation based on depth level, but cap at maxDepth
	const indentLevel = Math.min(comment.depth_level, maxDepth);
	const marginLeft = indentLevel * 16;

	// Show "View More Replies" button if depth is at maxDepth and has children
	const shouldShowViewMore =
		comment.depth_level >= maxDepth && comment.child_count > 0;

	return (
		<View style={[styles.container, { marginLeft }]}>
			<View style={styles.commentContainer}>
				<Avatar
					uri={comment.user_details.avatar}
					size={comment.depth_level > 2 ? 28 : 32}
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
							<View style={styles.userInfo}>
								<ThemedText style={styles.username}>
									{comment.user_details.display_name}
								</ThemedText>
								<ThemedText style={styles.handle}>
									@{comment.user_details.user_handle}
								</ThemedText>
								<ThemedText style={styles.timestamp}>
									· {timeAgo}
								</ThemedText>
							</View>

							{comment.child_count > 0 && onToggleCollapse && (
								<TouchableOpacity
									style={styles.collapseButton}
									onPress={() => onToggleCollapse(comment.id)}
								>
									{isCollapsed ? (
										<Ionicons
											name="chevron-forward"
											size={16}
											color={mutedColor}
										/>
									) : (
										<Ionicons
											name="chevron-down"
											size={16}
											color={mutedColor}
										/>
									)}
								</TouchableOpacity>
							)}
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

						{hasMedia && (
							<View style={styles.mediaContainer}>
								{comment.images.map((img, index) => (
									<Image
										key={`img-${index}`}
										source={{ uri: img?.url || '' }}
										style={styles.media}
									/>
								))}
								{comment.gifs.map((gif, index) => (
									<Image
										key={`gif-${index}`}
										source={{ uri: gif?.url || '' }}
										style={styles.media}
									/>
								))}
							</View>
						)}
					</ThemedView>

					<View style={styles.actions}>
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
								onPress={() => onReply(comment)}
							>
								{/* <Reply size={14} color={mutedColor} /> */}
								<ThemedText style={styles.actionText}>
									Reply
								</ThemedText>
							</TouchableOpacity>

							<TouchableOpacity style={styles.actionButton}>
								<Ionicons
									name="ellipsis-horizontal"
									size={14}
									color={mutedColor}
								/>
							</TouchableOpacity>
						</View>

						{shouldShowViewMore && onViewMoreReplies && (
							<TouchableOpacity
								style={styles.viewMoreButton}
								onPress={() => onViewMoreReplies(comment.id)}
							>
								<ThemedText style={styles.viewMoreText}>
									View {comment.child_count} more replies →
								</ThemedText>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>

			{/* Thread line for nested comments */}
			{comment.depth_level > 0 && (
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
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		flexWrap: 'wrap',
	},
	username: {
		fontWeight: '600',
		fontSize: 14,
		marginRight: 4,
	},
	handle: {
		fontSize: 12,
		color: '#666',
		marginRight: 4,
	},
	timestamp: {
		fontSize: 12,
		color: '#666',
	},
	collapseButton: {
		padding: 4,
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
		marginTop: 4,
		paddingHorizontal: 4,
	},
	actionButtons: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 16,
		padding: 4,
	},
	actionCount: {
		fontSize: 12,
		color: '#666',
		marginLeft: 4,
	},
	actionText: {
		fontSize: 12,
		color: '#666',
		marginLeft: 4,
	},
	viewMoreButton: {
		marginTop: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: 'rgba(0, 122, 255, 0.1)',
		borderRadius: 8,
		alignSelf: 'flex-start',
	},
	viewMoreText: {
		color: '#007AFF',
		fontSize: 13,
		fontWeight: '500',
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

export default NestedCommentItem;
