import React, { useCallback, useEffect, useState } from 'react';

import { ThemedButton } from '@/components/global/ThemedButton';
import ThemedSafeAreaView from '@/components/global/ThemedSafeAreaView';
import { ThemedText } from '@/components/global/ThemedText';
import { ThemedView } from '@/components/global/ThemedView';
import CreatePostModal from '@/components/posts/CreatePostModal';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import toastService from '@/services/global/toastService';
import postsService from '@/services/posts/postsService';
import { IPost } from '@/types/IPost';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const MainScreen: React.FC = () => {
	const navigation = useNavigation();
	const { user, logout } = useAuth();
	const [posts, setPosts] = useState<IPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const [nextPage, setNextPage] = useState<null | number>(1);
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const backgroundColor = useThemeColor({}, 'background');
	const tintColor = useThemeColor({}, 'tint');

	const fetchPosts = useCallback(async () => {
		try {
			setLoading(true);
			const res = await postsService.getPosts({
				page: nextPage || undefined,
			});
			setNextPage(res.nextPage);
			setPosts(res.items);
		} catch (error) {
			console.error('Error fetching posts:', error);
			toastService.error('Failed to load posts');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchPosts();
	}, [fetchPosts]);

	const fetchMorePosts = async () => {
		if (nextPage) {
			setIsFetchingMore(true);

			toastService.info('fetching page: ' + nextPage);

			const res = await postsService.getPosts({ page: nextPage });
			setNextPage(res.nextPage);
			setPosts((existingPosts) => [...existingPosts, ...res.items]);

			setIsFetchingMore(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const handlePostPress = (post: IPost) => {
		// @ts-expect-error navigation not typed
		navigation.navigate('post-detail', { post, commentLevel: 'main' });
	};

	const handleLogout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Logout', style: 'destructive', onPress: logout },
		]);
	};

	const renderPost = ({ item }: { item: IPost }) => (
		<View key={item.id} style={{ paddingHorizontal: 16 }}>
			<PostCard
				post={item}
				onPress={() => handlePostPress(item)}
				onComment={() => handlePostPress(item)}
			/>
		</View>
	);

	if (loading && !refreshing) {
		return (
			<ThemedView style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color={tintColor} />
			</ThemedView>
		);
	}

	return (
		<ThemedSafeAreaView style={styles.container}>
			<FlatList
				data={posts}
				keyExtractor={(item) => item.id}
				renderItem={renderPost}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={tintColor}
					/>
				}
				contentContainerStyle={styles.listContent}
				ListHeaderComponent={() => (
					<ThemedView style={styles.header}>
						<ThemedView>
							<ThemedText type="title" style={styles.welcomeText}>
								Welcome back!
							</ThemedText>
							{/* <ThemedText style={styles.userText}>
								@{user?.user_handle}
							</ThemedText> */}
						</ThemedView>
						<ThemedButton
							label="Logout"
							style={styles.logoutButton}
							onPress={handleLogout}
						>
							{/* <LogOut size={20} color="#666" /> */}
						</ThemedButton>
					</ThemedView>
				)}
				ListEmptyComponent={
					<ThemedView style={styles.emptyContainer}>
						<ThemedText style={styles.emptyText}>
							No posts yet. Create the first one!
						</ThemedText>
					</ThemedView>
				}
				onEndReached={fetchMorePosts}
				ListFooterComponent={
					<View>
						{isFetchingMore ? <ActivityIndicator /> : <></>}
					</View>
				}
			/>

			<TouchableOpacity
				style={[styles.fab, { backgroundColor: tintColor }]}
				onPress={() => setShowCreateModal(true)}
			>
				<ThemedText>
					<Ionicons name="add" size={24} color={backgroundColor} />
				</ThemedText>
			</TouchableOpacity>

			<CreatePostModal
				visible={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onPostCreated={fetchPosts}
			/>
		</ThemedSafeAreaView>
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
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(0,0,0,0.1)',
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	userText: {
		fontSize: 14,
		color: '#666',
		marginTop: 2,
	},
	logoutButton: {
		padding: 8,
		backgroundColor: 'transparent',
	},
	listContent: {
		paddingBottom: 80,
	},
	emptyContainer: {
		padding: 24,
		alignItems: 'center',
	},
	emptyText: {
		textAlign: 'center',
		color: '#666',
	},
	fab: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
});

export default MainScreen;
