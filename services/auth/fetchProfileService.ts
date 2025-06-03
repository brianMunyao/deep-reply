import axiosClient from '@/configs/axiosConfig';
import ApiPaths from '@/constants/ApiPaths';

export const fetchProfileService = async () => {
	try {
		const response = await axiosClient.get(ApiPaths.PROFILE_INFORMATION);
		return response.data;
	} catch (error: any) {
		console.error('Fetching profile failed:', error);
		throw error;
	}
};
