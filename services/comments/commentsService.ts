import axiosClient from '@/configs/axiosConfig';
import ApiPaths from '@/constants/ApiPaths';
import { ICommentNew } from '@/types/IComment';

const createComment = async (newComment: ICommentNew) => {
	try {
		const response = await axiosClient.post(ApiPaths.COMMENTS, newComment);
		return response.data;
	} catch (error: any) {
		console.error(
			'Create comment error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const getComments = async (filters: { post_id?: string; user_id?: string }) => {
	try {
		const urlParams = new URLSearchParams();
		if (filters?.post_id)
			urlParams.set('post_id', filters?.post_id.toString());
		if (filters?.user_id)
			urlParams.set('user_id', filters?.user_id.toString());

		const response = await axiosClient.get(
			ApiPaths.COMMENTS + '?' + urlParams.toString()
		);

		return response.data;
	} catch (error: any) {
		console.error(
			'Get comments error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const getReplies = async (postId: string) => {
	try {
		const response = await axiosClient.get(
			`${ApiPaths.COMMENTS}/${postId}/replies`
		);
		return response.data;
	} catch (error: any) {
		console.error(
			'Get replies error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const getDeepReplies = async (postId: string) => {
	try {
		const response = await axiosClient.get(
			`${ApiPaths.COMMENTS}/${postId}/deep-replies`
		);
		return response.data;
	} catch (error: any) {
		console.error(
			'Get deep replies error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const deleteComment = async (commentId: string) => {
	try {
		const response = await axiosClient.delete(`${ApiPaths.COMMENTS}`, {
			data: { comment_id: commentId },
		});
		return response.data;
	} catch (error: any) {
		console.error(
			'Delete comment error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const commentService = {
	createComment,
	getComments,
	getReplies,
	getDeepReplies,
	deleteComment,
};

export default commentService;
