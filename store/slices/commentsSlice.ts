import { IComment } from '@/types/IComment';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CommentsState = {
	commentsByPost: Record<string, IComment[]>;
	loading: boolean;
};

const initialState: CommentsState = {
	commentsByPost: {},
	loading: false,
};

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		setComments(
			state,
			action: PayloadAction<{ postId: string; comments: IComment[] }>
		) {
			state.commentsByPost[action.payload.postId] =
				action.payload.comments;
		},
		addComment(
			state,
			action: PayloadAction<{ postId: string; comment: IComment }>
		) {
			const { postId, comment } = action.payload;
			if (!state.commentsByPost[postId]) {
				state.commentsByPost[postId] = [];
			}
			state.commentsByPost[postId].push(comment);
		},
		removeComment(
			state,
			action: PayloadAction<{ postId: string; commentId: string }>
		) {
			const { postId, commentId } = action.payload;
			state.commentsByPost[postId] = state.commentsByPost[postId]?.filter(
				(comment) => comment.id !== commentId
			);
		},
		setCommentsLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
	},
});

export const { setComments, addComment, removeComment, setCommentsLoading } =
	commentsSlice.actions;
export default commentsSlice.reducer;
