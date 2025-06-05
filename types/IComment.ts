export type ICommentNew = {
	post_id: string;
	content: string;
	reply_to?: string;
	mentioned_users: string[];
	openai_thread_id?: string;
	images: {
		id: string;
		url: string;
		preview_url: string;
	}[];
	gifs: {
		url: string;
		slug: string;
		preview_url: string;
	}[];
};

export type IComment = {
	id: string;
	created_at: string | number;
	updated_at: number;
	user_id: string;
	reply_to: string;
	post_id: string;
	content: string;
	score: number;
	status: string;
	mentioned_users: string[];
	scheduled_deletion_at: number;
	is_deleted: boolean;
	depth_level: number;
	path: string;
	child_count: number;
	openai_thread_id: string;
	images: {
		url?: string;
		preview_url: string;
		blur: boolean;
	}[];
	gifs: {
		url?: string;
		slug: string;
		preview_url: string;
	}[];
	user_details: {
		id: string;
		created_at: string;
		updated_at: string;
		user_handle: string;
		wallet: string;
		avatar: string;
		banner: string;
		default_avatar_color: string;
		avatar_nft_chain: string;
		display_name: string;
		bio: string;
		website: string;
		aura: number;
		role_id: string;
		welcome_complete: boolean;
		privacy_and_terms: boolean;
		online: boolean;
		banned: boolean;
		twitter_connected: boolean;
		number_of_nfts: number;
		start_of_earning_eligibilty: number;
		referral_code: string;
		referred_by: string;
		old_wallet: string;
		twitter_oauth: {
			user_id: string;
			screen_name: string;
		};
		google_oauth: {
			id: string;
		};
		settings: {
			notifications: {
				replies: string;
				mentions: string;
				direct_messages: string;
				community_updates: string;
				likes: string;
				comments_on_your_posts: string;
			};
			acconuts: {
				twitter: boolean;
				google: boolean;
				wallet: boolean;
				two_factor_auth_enabled: boolean;
			};
		};
	};
};
