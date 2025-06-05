export type IPostNew = {
	community_id: string;
	title: string;
	content: string;
	content_type: string;
	link?: string;
	mentioned_users: string[];
	poll_options: string[];
	date_poll_end: number;
	reposted_posts_id: string;
	video_metadata: Record<string, any>;
	gifs: {
		url: string;
		slug: string;
		preview_url: string;
	}[];
	images: {
		id: string;
		url: string;
		preview_url: string;
	}[];
	video_file_url: {
		id: string;
		url: string;
	}[];
};

export type IPost = IPostNew & { post_id: string; id: string };

// responses

export type IGetPostsResponse = {
	curPage: number;
	items: IPost[];
	itemsReceived: number;
	itemsTotal: number;
	nextPage: number;
	offset: number;
	pageTotal: number;
	perPage: number;
	prevPage: number | null;
};
