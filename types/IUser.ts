export type ILoginPayload = {
	user_handle: string;
	password: string;
};

export type IUser = {
	id: string;
	user_handle: string;
	[key: string]: any;
};
