import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

import NestedCommentItem from '@/components/comments/NestedCommentItem';
import ThemedSafeAreaView from '@/components/global/ThemedSafeAreaView';
import { ThemedText } from '@/components/global/ThemedText';
import { ThemedTextInput } from '@/components/global/ThemedTextInput';
import { ThemedView } from '@/components/global/ThemedView';
import PostCard from '@/components/posts/PostCard';

import { useThemeColor } from '@/hooks/useThemeColor';
import commentService from '@/services/comments/commentsService';
import toastService from '@/services/global/toastService';
import type { IComment } from '@/types/IComment';
import type { IPost } from '@/types/IPost';

const { width } = Dimensions.get('window');

interface PostDetailScreenParams {
	post: IPost;
	commentLevel?: 'main' | 'replies' | 'deep-replies';
	parentCommentId?: string;
}

const PostDetailScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const {
		post,
		commentLevel = 'main',
		parentCommentId,
	} = route.params as PostDetailScreenParams;

	const [comments, setComments] = useState<IComment[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [newComment, setNewComment] = useState('');
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [collapsedComments, setCollapsedComments] = useState<Set<string>>(
		new Set()
	);
	const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);

	const [submitting, setSubmitting] = useState(false);

	const fadeAnim = useState(new Animated.Value(0))[0];
	const slideAnim = useState(new Animated.Value(50))[0];

	const tintColor = useThemeColor({}, 'tint');
	const cardBackgroundColor = useThemeColor({}, 'cardBackground');
	const buttonPrimaryBackground = useThemeColor(
		{},
		'buttonPrimaryBackground'
	);
	const secondary = useThemeColor({}, 'secondary');
	const backgroundColor = useThemeColor({}, 'background');
	const textColor = useThemeColor({}, 'text');
	const borderColor = useThemeColor({}, 'separator');

	const maxDepth = useMemo(() => {
		switch (commentLevel) {
			case 'replies':
				return 8;
			case 'deep-replies':
				return 12;
			default:
				return 4;
		}
	}, [commentLevel]);

	const screenTitle = useMemo(() => {
		switch (commentLevel) {
			case 'replies':
				return 'Replies (Level 5-8)';
			case 'deep-replies':
				return 'Deep Replies (Level 9-12)';
			default:
				return 'Comments';
		}
	}, [commentLevel]);

	const sortedComments = useMemo(() => {
		const sorted = [...comments].sort(
			(a, b) =>
				new Date(a.created_at).getTime() -
				new Date(b.created_at).getTime()
		);

		return sorted;
	}, [comments]);

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	const fetchComments = useCallback(async () => {
		try {
			setLoading(true);
			let fetchedComments: IComment[] = [];

			switch (commentLevel) {
				case 'main':
					fetchedComments = await commentService.getComments({
						post_id: post.id,
					});
					break;
				case 'replies':
					fetchedComments = await commentService.getReplies(
						parentCommentId || post.id
					);
					break;
				case 'deep-replies':
					fetchedComments = await commentService.getDeepReplies(
						parentCommentId || post.id
					);
					break;
			}

			// Filter comments based on depth level
			const filtered = fetchedComments.filter((comment) => {
				const level = comment.depth_level;
				switch (commentLevel) {
					case 'main':
						return level <= 4;
					case 'replies':
						return level >= 5 && level <= 8;
					case 'deep-replies':
						return level >= 9 && level <= 12;
					default:
						return true;
				}
			});

			setComments(filtered);
		} catch (error) {
			console.error('Error fetching comments:', error);
			toastService.error('Failed to load comments');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [post.id, commentLevel, parentCommentId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchComments();
	}, [fetchComments]);

	const handleAddComment = async () => {
		const trimmedComment = newComment.trim();
		if (!trimmedComment) {
			toastService.error('Please enter a comment');
			return;
		}

		if (trimmedComment.length > 1000) {
			toastService.error('Comment is too long (max 1000 characters)');
			return;
		}

		setSubmitting(true);

		try {
			await commentService.createComment({
				post_id: post.id,
				content: trimmedComment,
				reply_to: replyingTo || '',
				// using the user that we are replying to for now
				// to be updated later
				mentioned_users: mentionedUsers,
				images: [],
				gifs: [],
			});

			setMentionedUsers([]);
			setNewComment('');
			setReplyingTo(null);
			toastService.success('Comment added successfully');
			await fetchComments();
		} catch (error) {
			console.error('Failed to add comment:', error);
			toastService.error('Failed to add comment');
		} finally {
			setSubmitting(false);
		}
	};

	const handleReply = useCallback((comment: IComment) => {
		setReplyingTo(comment.id);

		// for now we tag one at a time
		setMentionedUsers([comment.user_details.id]);

		setNewComment(`@${comment.user_details.user_handle} `);
	}, []);

	const handleViewMoreReplies = useCallback(
		(commentId: string) => {
			const nextLevel =
				commentLevel === 'main' ? 'replies' : 'deep-replies';
			// @ts-expect-error navigation not typed
			navigation.navigate('post-detail', {
				post,
				commentLevel: nextLevel,
				parentCommentId: commentId,
			});
		},
		[commentLevel, navigation, post]
	);

	const handleToggleCollapse = useCallback((commentId: string) => {
		setCollapsedComments((prev) => {
			const updated = new Set(prev);
			if (updated.has(commentId)) {
				updated.delete(commentId);
			} else {
				updated.add(commentId);
			}
			return updated;
		});
	}, []);

	const handleCommentDelete = (commentId: string) => {
		setComments((_comments) => {
			return _comments.filter((c) => c.id !== commentId);
		});
	};

	const renderComment = useCallback(
		({ item, index }: { item: IComment; index: number }) => {
			// Don't render if parent is collapsed
			if (item.reply_to && collapsedComments.has(item.reply_to)) {
				return null;
			}

			return (
				<Animated.View
					style={[
						{ paddingHorizontal: 15 },
						{
							opacity: fadeAnim,
							transform: [{ translateY: slideAnim }],
						},
					]}
				>
					<NestedCommentItem
						comment={item}
						onReply={handleReply}
						onViewMoreReplies={handleViewMoreReplies}
						maxDepth={maxDepth}
						isCollapsed={collapsedComments.has(item.id)}
						onToggleCollapse={handleToggleCollapse}
						onDelete={() => handleCommentDelete(item.id)}
					/>
				</Animated.View>
			);
		},
		[
			collapsedComments,
			fadeAnim,
			slideAnim,
			handleReply,
			handleViewMoreReplies,
			maxDepth,
			handleToggleCollapse,
		]
	);

	const renderBackButton = (title: string) => (
		<ThemedView style={[styles.header, {}]}>
			<TouchableOpacity
				onPress={() => router.back()}
				activeOpacity={0.7}
				style={[
					styles.backButton,
					{ backgroundColor: backgroundColor },
				]}
			>
				<Ionicons name="arrow-back" size={20} color={textColor} />
			</TouchableOpacity>
			<ThemedText style={styles.headerTitle}>{title}</ThemedText>
			<View style={styles.headerSpacer} />
		</ThemedView>
	);

	const renderEmptyState = () => (
		<ThemedView style={styles.emptyContainer}>
			<Ionicons name="chatbubbles-outline" size={48} color={secondary} />
			<ThemedText style={styles.emptyTitle}>No comments yet</ThemedText>
			<ThemedText style={styles.emptySubtitle}>
				Be the first to share your thoughts!
			</ThemedText>
		</ThemedView>
	);

	const renderListHeader = () => {
		if (commentLevel === 'main') {
			return (
				<View style={styles.headerSection}>
					{renderBackButton('View Post')}

					<View style={{ paddingHorizontal: 16 }}>
						<PostCard
							post={post}
							onPress={() => {}}
							onComment={() => {}}
						/>
					</View>
					<ThemedView style={styles.commentsHeader}>
						<View style={styles.commentsHeaderRow}>
							<ThemedText style={styles.commentsTitle}>
								Comments ({comments.length})
							</ThemedText>
						</View>
					</ThemedView>
				</View>
			);
		}
		return (
			<ThemedView style={styles.repliesHeader}>
				<ThemedText style={styles.commentsTitle}>
					{screenTitle} ({comments.length})
				</ThemedText>
			</ThemedView>
		);
	};

	if (loading && !refreshing) {
		return (
			<ThemedView style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color={tintColor} />
				<ThemedText style={styles.loadingText}>
					Loading comments...
				</ThemedText>
			</ThemedView>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<ThemedSafeAreaView style={[styles.container]}>
				{commentLevel !== 'main' && renderBackButton(screenTitle)}

				<FlatList
					data={sortedComments}
					keyExtractor={(item) => item.id}
					renderItem={renderComment}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={tintColor}
							colors={[tintColor]}
						/>
					}
					ListHeaderComponent={renderListHeader()}
					ListEmptyComponent={renderEmptyState()}
					contentContainerStyle={[
						styles.listContent,
						{ paddingBottom: Platform.OS === 'ios' ? 120 : 140 },
					]}
					showsVerticalScrollIndicator={false}
					removeClippedSubviews={true}
					maxToRenderPerBatch={10}
					windowSize={10}
					initialNumToRender={5}
				/>

				<View style={styles.inputContainer}>
					<ThemedTextInput
						value={newComment}
						onChangeText={setNewComment}
						placeholder={
							replyingTo ? 'Write a reply...' : 'Add a comment...'
						}
						style={[styles.textInput, { borderColor }]}
						multiline
						maxLength={1000}
						textAlignVertical="top"
					/>

					<TouchableOpacity
						onPress={handleAddComment}
						style={[
							styles.sendButton,
							{
								backgroundColor: newComment.trim()
									? buttonPrimaryBackground
									: secondary,
								opacity: submitting ? 0.6 : 1,
							},
						]}
						disabled={!newComment.trim() || submitting}
						activeOpacity={0.8}
					>
						{submitting ? (
							<ActivityIndicator size="small" color="#fff" />
						) : (
							<Ionicons name="send" size={18} color="#fff" />
						)}
					</TouchableOpacity>
				</View>
			</ThemedSafeAreaView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
		fontSize: 14,
		opacity: 0.7,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		paddingVertical: 12,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		flex: 1,
		textAlign: 'center',
	},
	headerSpacer: {
		width: 35,
	},
	backButton: {
		width: 35,
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 17.5,
		elevation: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
	},
	headerSection: {
		gap: 15,
	},
	repliesHeader: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	commentsHeader: {
		paddingHorizontal: 15,
		paddingTop: 15,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	commentsHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	commentsTitle: {
		fontSize: 18,
		fontWeight: '600',
	},
	emptyContainer: {
		alignItems: 'center',
		paddingVertical: 60,
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginTop: 16,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		textAlign: 'center',
		opacity: 0.7,
		lineHeight: 20,
	},
	inputWrapper: {
		paddingHorizontal: 15,
		paddingVertical: 1,
		borderTopWidth: StyleSheet.hairlineWidth,
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},

	replyingBanner: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		marginBottom: 12,
	},

	closeReplyButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listContent: {
		paddingTop: 10,
	},

	inputContainer: {
		position: 'relative',
	},

	textInput: {
		// minHeight: 1210,
		// maxHeight: 1200,
		// padding: 12,
		paddingRight: 48,
		fontSize: 15,
		borderWidth: 1,
		borderRadius: 8,
	},

	sendButton: {
		position: 'absolute',
		right: 8,
		bottom: 8,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 20,
	},
});

export default PostDetailScreen;
