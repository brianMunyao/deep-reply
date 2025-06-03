import axiosClient from '@/configs/axiosConfig';
import ApiPaths from '@/constants/ApiPaths';

const createComment = async (
	post_id: string,
	content: string,
	parent_id: string | null
) => {
	try {
		const response = await axiosClient.post(ApiPaths.COMMENTS, {
			post_id,
			content,
			parent_id,
		});
		return response.data;
	} catch (error: any) {
		console.error(
			'Create comment error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const getComments = async () => {
	try {
		const response = await axiosClient.get(ApiPaths.COMMENTS);
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
		const response = await axiosClient.delete(
			`${ApiPaths.COMMENTS}/${commentId}`
		);
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
