import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import Toast, {
	BaseToast,
	BaseToastProps,
	ErrorToast,
} from "react-native-toast-message"

const AppToaster = () => {
	const containerStyle: ViewStyle = {
		borderRadius: 12,
	}
	const contentContainerStyle: ViewStyle = {
		paddingHorizontal: 2,
		overflow: "hidden",
	}
	const text1Style: TextStyle = {
		fontSize: 15,
		fontWeight: "bold",
	}
	const text2Style: TextStyle = {
		fontSize: 13,
	}

	const toastConfig = {
		/*
		  Overwrite 'success' type with a fully green background.
		*/
		success: (props: BaseToastProps) => (
			<BaseToast
				{...props}
				style={{
					...containerStyle,
					backgroundColor: "green",
					borderLeftColor: "darkgreen",
				}}
				contentContainerStyle={contentContainerStyle}
				text1Style={{ ...text1Style, color: "white" }}
				text2Style={{ ...text2Style, color: "white" }}
				renderLeadingIcon={() => (
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 45,
						}}>
						<Ionicons
							name="checkmark-circle"
							size={25}
							color="white"
						/>
					</View>
				)}
			/>
		),
		/*
		  Custom 'info' type with blue background and icon.
		*/
		info: (props: BaseToastProps) => (
			<BaseToast
				{...props}
				style={{
					...containerStyle,
					backgroundColor: "#00A7BC",
					borderLeftColor: "#045e6a",
				}}
				contentContainerStyle={contentContainerStyle}
				text1Style={{ ...text1Style, color: "white" }}
				text2Style={{ ...text2Style, color: "white" }}
				renderLeadingIcon={() => (
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 45,
						}}>
						<Ionicons
							name="information-circle"
							size={25}
							color="white"
						/>
					</View>
				)}
			/>
		),
		/*
		  Overwrite 'error' type with a fully red background.
		*/
		error: (props: BaseToastProps) => (
			<ErrorToast
				{...props}
				style={{
					...containerStyle,
					backgroundColor: "red",
					borderLeftColor: "darkred",
				}}
				contentContainerStyle={contentContainerStyle}
				text1Style={{ ...text1Style, color: "white" }}
				text2Style={{ ...text2Style, color: "white" }}
				renderLeadingIcon={() => (
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 45,
						}}>
						<Ionicons name="alert-circle" size={25} color="white" />
					</View>
				)}
			/>
		),
		/*
		  Custom type 'warning'.
		*/
		warning: (props: BaseToastProps) => (
			<BaseToast
				{...props}
				style={{
					...containerStyle,
					backgroundColor: "#FF9F43",
					borderLeftColor: "#E68F3C",
				}}
				contentContainerStyle={contentContainerStyle}
				text1Style={{ ...text1Style, color: "white" }}
				text2Style={{ ...text2Style, color: "white" }}
				renderLeadingIcon={() => (
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 45,
						}}>
						<Ionicons name="warning" size={25} color="white" />
					</View>
				)}
			/>
		),
	}

	return <Toast config={toastConfig} />
}

export default AppToaster
