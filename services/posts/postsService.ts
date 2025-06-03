import axiosClient from '@/configs/axiosConfig';
import ApiPaths from '@/constants/ApiPaths';

const COMMUNITY_ID = '118af618-b3ef-403e-8bbd-92af080b973a';

const createPost = async (content: string) => {
	try {
		const response = await axiosClient.post(ApiPaths.POSTS, {
			content,
			community_id: COMMUNITY_ID,
		});
		return response.data;
	} catch (error: any) {
		console.error(
			'Create post error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const getPosts = async () => {
	try {
		const response = await axiosClient.get(ApiPaths.POSTS);
		return response.data;
	} catch (error: any) {
		console.error(
			'Get posts error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const deletePost = async (postId: string) => {
	try {
		const response = await axiosClient.delete(
			`${ApiPaths.POSTS}/${postId}`
		);
		return response.data;
	} catch (error: any) {
		console.error(
			'Delete post error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const postsService = { createPost, getPosts, deletePost };

export default postsService;
