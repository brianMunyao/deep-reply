import axiosClient from '@/configs/axiosConfig';
import ApiPaths from '@/constants/ApiPaths';
import { IGetPostsResponse, IPostNew } from '@/types/IPost';

export const COMMUNITY_ID = '118af618-b3ef-403e-8bbd-92af080b973a';

const createPost = async (newPost: IPostNew) => {
	try {
		const response = await axiosClient.post(ApiPaths.POSTS, newPost);

		return response.data;
	} catch (error: any) {
		console.error(
			'Create post error:',
			error?.response?.data || error.message
		);
		throw error;
	}
};

const getPosts = async (filters: {
	page?: number;
	per_page?: number;
	offset?: number;
	sort?: 'score' | 'latest';
	user_id?: string;
}) => {
	try {
		const urlParams = new URLSearchParams();

		urlParams.set('sort', 'latest');

		if (filters?.page) urlParams.set('page', filters?.page.toString());
		if (filters?.per_page)
			urlParams.set('per_page', filters?.per_page.toString());

		const response = await axiosClient.get<IGetPostsResponse>(
			ApiPaths.POSTS + '?' + urlParams.toString()
		);

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
			`${ApiPaths.POSTS}/${postId}`,
			{ data: { posts_id: postId } }
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
