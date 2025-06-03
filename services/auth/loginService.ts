import axiosClient from '@/configs/axiosConfig';
import ApiPaths from '@/constants/ApiPaths';
import { ILoginPayload } from '@/types/IUser';

export const loginService = async ({
	user_handle,
	password,
}: ILoginPayload) => {
	try {
		const response = await axiosClient.post(ApiPaths.LOGIN, {
			user_handle,
			password,
		});

		return response.data;
	} catch (error: any) {
		// console.error(
		// 	'Login service error:',
		// 	error?.response?.data || error.message
		// );
		throw new Error(error?.response?.data?.message || error.message);
	}
};
