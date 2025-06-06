import { ThemedText } from '@/components/global/ThemedText';
import { ThemedView } from '@/components/global/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IPost } from '@/types/IPost';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
	Alert,
	Animated,
	Image,
	Linking,
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import PostMenuOptions from './PostMenuOptions';

type Props = {
	post: IPost;
	onPress: (postId: string) => void;
	onComment?: (postId: string) => void;
	onLike?: (postId: string) => void;
	onShare?: (postId: string) => void;
	onBookmark?: (postId: string) => void;
	showActions?: boolean;
	compact?: boolean;
};

const PostCard = ({
	post,
	onPress,
	onComment,
	onLike,
	onShare,
	onBookmark,
	showActions = true,
	compact = false,
}: Props) => {
	const [liked, setLiked] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [imageError, setImageError] = useState<Set<string>>(new Set());

	// Animation
	const scaleAnim = useState(new Animated.Value(1))[0];
	const likeAnim = useState(new Animated.Value(1))[0];

	// Theme colors
	const cardBackground = useThemeColor({}, 'cardBackground');
	const textColor = useThemeColor({}, 'text');
	const mutedColor = useThemeColor({}, 'secondary');
	const tintColor = useThemeColor({}, 'tint');
	const borderColor = useThemeColor({}, 'separator');

	const [isPostOptionsOpen, setIsPostOptionsOpen] = useState(false);
	const [openedPost, setOpenedPost] = useState<IPost | null>(null);

	// Computed values
	const hasMedia = useMemo(() => {
		return (
			(post?.images || []).filter(Boolean).length > 0 ||
			(post?.gifs || []).filter(Boolean).length > 0
		);
	}, [post]);

	const mediaItems = useMemo(() => {
		const items = [];
		if (post?.images) {
			items.push(
				...post.images.map((img) => ({
					...img,
					type: 'image' as const,
				}))
			);
		}
		if (post?.gifs) {
			items.push(
				...post.gifs.map((gif) => ({
					...gif,
					type: 'gif' as const,
					id: gif?.slug || '',
				}))
			);
		}
		return items;
	}, [post]);

	const shouldTruncateContent = useMemo(() => {
		if (!post?.content) return false;
		const maxLength = hasMedia ? 150 : 300;
		return post.content.length > maxLength;
	}, [post?.content, hasMedia]);

	const displayContent = useMemo(() => {
		if (!post?.content) return '';
		if (!shouldTruncateContent || expanded) return post.content;
		const maxLength = hasMedia ? 150 : 300;
		return post.content.substring(0, maxLength) + '...';
	}, [post?.content, shouldTruncateContent, expanded, hasMedia]);

	// Handlers
	const handlePress = () => {
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.98,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();

		onPress(post.id);
	};

	const handleLike = () => {
		setLiked(!liked);

		Animated.sequence([
			Animated.timing(likeAnim, {
				toValue: 1.2,
				duration: 150,
				useNativeDriver: true,
			}),
			Animated.timing(likeAnim, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			}),
		]).start();

		if (onLike) onLike(post.id);
	};

	const handleShare = async () => {
		try {
			if (onShare) {
				onShare(post.id);
			} else {
				await Share.share({
					message: `${post.title}\n\n${post.content}${
						post.link ? `\n\n${post.link}` : ''
					}`,
					title: post.title,
				});
			}
		} catch (error) {
			console.error('Error sharing:', error);
		}
	};

	const handleBookmark = () => {
		setBookmarked(!bookmarked);
		if (onBookmark) onBookmark(post.id);
	};

	const handleLinkPress = async () => {
		if (!post.link) return;

		try {
			const supported = await Linking.canOpenURL(post.link);
			if (supported) {
				await Linking.openURL(post.link);
			} else {
				Alert.alert('Error', 'Cannot open this link');
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to open link');
		}
	};

	const handleImageError = (imageId: string) => {
		setImageError((prev) => new Set([...prev, imageId]));
	};

	const renderMedia = () => {
		if (!hasMedia || mediaItems.length === 0) return null;

		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.mediaContainer}
				contentContainerStyle={styles.mediaContent}
			>
				{mediaItems.map((item, index) => {
					// @ts-ignore
					const imageId = 'id' in item ? item.id : item?.slug || '';
					if (imageError.has(imageId)) return null;

					return (
						<TouchableOpacity
							key={imageId}
							style={styles.mediaItem}
							activeOpacity={0.9}
						>
							<Image
								source={{
									uri:
										'preview_url' in item
											? item.preview_url
											: // @ts-ignore
											  item.url,
								}}
								style={styles.mediaImage}
								resizeMode="cover"
								onError={() => handleImageError(imageId)}
							/>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		);
	};

	const renderActions = () => {
		if (!showActions) return null;

		return (
			<View style={[styles.footer, { borderTopColor: borderColor }]}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={handleLike}
					activeOpacity={0.7}
				>
					<Animated.View style={{ transform: [{ scale: likeAnim }] }}>
						<Ionicons
							name={liked ? 'heart' : 'heart-outline'}
							size={18}
							color={liked ? '#FF4D4D' : mutedColor}
						/>
					</Animated.View>
					<ThemedText
						style={[
							styles.actionText,
							liked && { color: '#FF4D4D' },
						]}
					>
						{liked ? 'Liked' : 'Like'}
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => onComment && onComment(post.id)}
					activeOpacity={0.7}
				>
					<Ionicons
						name="chatbubble-outline"
						size={18}
						color={mutedColor}
					/>
					<ThemedText style={styles.actionText}>Comment</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.actionButton}
					onPress={handleShare}
					activeOpacity={0.7}
				>
					<Ionicons
						name="share-outline"
						size={18}
						color={mutedColor}
					/>
					<ThemedText style={styles.actionText}>Share</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.actionButton}
					onPress={handleBookmark}
					activeOpacity={0.7}
				>
					<Ionicons
						name={bookmarked ? 'bookmark' : 'bookmark-outline'}
						size={18}
						color={bookmarked ? tintColor : mutedColor}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<>
			<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
				<TouchableOpacity activeOpacity={0.95} onPress={handlePress}>
					<ThemedView
						style={[
							styles.card,
							{ backgroundColor: cardBackground },
							compact && styles.compactCard,
						]}
					>
						{/* Header */}
						<View style={styles.header}>
							<View style={styles.titleContainer}>
								<ThemedText
									style={[
										styles.title,
										compact && styles.compactTitle,
									]}
									numberOfLines={compact ? 1 : 2}
								>
									{post.title}
								</ThemedText>
							</View>

							<TouchableOpacity
								style={styles.moreButton}
								activeOpacity={0.7}
								onPress={() => {
									setIsPostOptionsOpen(true);
									setOpenedPost(post);
								}}
							>
								<Ionicons
									name="ellipsis-horizontal"
									size={20}
									color={mutedColor}
								/>
							</TouchableOpacity>
						</View>

						{/* Content */}
						<View style={styles.contentContainer}>
							<ThemedText
								style={[
									styles.content,
									compact && styles.compactContent,
								]}
								numberOfLines={compact ? 2 : undefined}
							>
								{displayContent}
							</ThemedText>

							{shouldTruncateContent && !compact && (
								<TouchableOpacity
									onPress={() => setExpanded(!expanded)}
									style={styles.expandButton}
								>
									<ThemedText
										style={[
											styles.expandText,
											{ color: tintColor },
										]}
									>
										{expanded ? 'Show less' : 'Read more'}
									</ThemedText>
								</TouchableOpacity>
							)}
						</View>

						{/* Media */}
						{!compact && renderMedia()}

						{/* Link Preview */}
						{post.link && (
							<TouchableOpacity
								style={[styles.linkContainer, { borderColor }]}
								onPress={handleLinkPress}
								activeOpacity={0.8}
							>
								<Ionicons
									name="link-outline"
									size={16}
									color={tintColor}
								/>
								<ThemedText
									style={[
										styles.linkText,
										{ color: tintColor },
									]}
									numberOfLines={1}
								>
									{post.link}
								</ThemedText>
								<Ionicons
									name="open-outline"
									size={14}
									color={mutedColor}
								/>
							</TouchableOpacity>
						)}

						{/* Actions */}
						{renderActions()}
					</ThemedView>
				</TouchableOpacity>
			</Animated.View>

			<PostMenuOptions
				visible={isPostOptionsOpen}
				onClose={() => setIsPostOptionsOpen(false)}
				post={openedPost}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	card: {
		padding: 16,
		borderRadius: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 3,
	},
	compactCard: {
		padding: 12,
		marginBottom: 8,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	titleContainer: {
		flex: 1,
		marginRight: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		lineHeight: 24,
		marginBottom: 4,
	},
	compactTitle: {
		fontSize: 16,
		marginBottom: 2,
	},
	timestamp: {
		fontSize: 12,
		opacity: 0.6,
	},
	moreButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(0,0,0,0.05)',
	},
	contentContainer: {
		marginBottom: 12,
	},
	content: {
		fontSize: 15,
		lineHeight: 22,
		marginBottom: 8,
	},
	compactContent: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 4,
	},
	expandButton: {
		alignSelf: 'flex-start',
		paddingVertical: 4,
	},
	expandText: {
		fontSize: 14,
		fontWeight: '600',
	},
	mediaContainer: {
		marginBottom: 12,
	},
	mediaContent: {
		paddingRight: 16,
	},
	mediaItem: {
		marginRight: 12,
		borderRadius: 12,
		overflow: 'hidden',
		position: 'relative',
	},
	mediaImage: {
		width: 120,
		height: 120,
		borderRadius: 12,
	},
	gifBadge: {
		position: 'absolute',
		top: 8,
		right: 8,
		backgroundColor: 'rgba(0,0,0,0.7)',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	gifText: {
		color: '#fff',
		fontSize: 10,
		fontWeight: '600',
	},
	linkContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderWidth: 1,
		borderRadius: 12,
		marginBottom: 12,
		backgroundColor: 'rgba(0,122,255,0.05)',
	},
	linkText: {
		flex: 1,
		fontSize: 14,
		marginLeft: 8,
		marginRight: 8,
		fontWeight: '500',
	},
	typeBadge: {
		position: 'absolute',
		top: 12,
		right: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	typeText: {
		fontSize: 10,
		fontWeight: '700',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		backgroundColor: 'rgba(0,0,0,0.03)',
	},
	actionText: {
		fontSize: 13,
		marginLeft: 6,
		fontWeight: '500',
		opacity: 0.8,
	},
});

export default PostCard;
