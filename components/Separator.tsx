import React from 'react';
import { View, ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

type Props = ViewProps & {};

const Separator = ({ style, ...otherProps }: Props) => {
	const separatorColor = useThemeColor({}, 'separator');

	return (
		<View
			{...otherProps}
			style={[{ height: 2, backgroundColor: separatorColor }, style]}
		/>
	);
};

export default Separator;
