import { SafeAreaView, StatusBar, type ViewProps } from "react-native"

import { useThemeColor } from "@/hooks/useThemeColor"

export type ThemedSafeAreaViewProps = ViewProps & {
	lightColor?: string
	darkColor?: string
}

/**
 *
 * This uses `SafeAreaView` to avoid collision with the StatusBar
 *
 */
const ThemedSafeAreaView = ({
	style,
	lightColor,
	darkColor,
	...otherProps
}: ThemedSafeAreaViewProps) => {
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background",
	)

	return (
		<SafeAreaView
			style={[
				{
					backgroundColor,
					paddingTop: StatusBar.currentHeight,
					flex: 1,
				},
				style,
			]}
			{...otherProps}
		/>
	)
}

export default ThemedSafeAreaView
