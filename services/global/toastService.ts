import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
	title: string;
	description?: string;
	duration?: number;
};

type IToastParam = ToastOptions | string;

const TOAST_DURATION = 3000;

const showToast = (type: ToastType, param: IToastParam) => {
	if (typeof param === 'string') {
		Toast.show({
			type,
			text1: param,
			visibilityTime: TOAST_DURATION,
			swipeable: true,
		});
	} else {
		Toast.show({
			type,
			text1: param.title,
			text2: param.description,
			visibilityTime: param?.duration || TOAST_DURATION,
			swipeable: true,
		});
	}
};

const toastService = {
	info: (param: IToastParam) => showToast('info', param),
	warning: (param: IToastParam) => showToast('warning', param),
	success: (param: IToastParam) => showToast('success', param),
	error: (param: IToastParam) => showToast('error', param),
};

export default toastService;
