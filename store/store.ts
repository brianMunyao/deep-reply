import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from './slices/commentsSlice';
import postsReducer from './slices/postsSlice';

export const store = configureStore({
	reducer: {
		posts: postsReducer,
		comments: commentsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
