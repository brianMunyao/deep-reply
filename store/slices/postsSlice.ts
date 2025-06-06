import { IPost } from '@/types/IPost';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PostsState = {
	posts: IPost[];
	loading: boolean;
};

const initialState: PostsState = {
	posts: [],
	loading: false,
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		setPosts(state, action: PayloadAction<IPost[]>) {
			state.posts = action.payload;
		},
		addPost(state, action: PayloadAction<IPost>) {
			state.posts.unshift(action.payload);
		},
		removePost(state, action: PayloadAction<string>) {
			state.posts = state.posts.filter(
				(post) => post.post_id !== action.payload
			);
		},
		setPostsLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
	},
});

export const { setPosts, addPost, removePost, setPostsLoading } =
	postsSlice.actions;
export default postsSlice.reducer;
