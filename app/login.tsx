import { ThemedButton } from '@/components/global/ThemedButton';
import ThemedSafeAreaView from '@/components/global/ThemedSafeAreaView';
import { ThemedText } from '@/components/global/ThemedText';
import { ThemedTextInput } from '@/components/global/ThemedTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { ILoginPayload } from '@/types/IUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import * as z from 'zod';

const LoginScreen = () => {
	const { login } = useAuth();
	const [formError, setFormError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const schema = z.object({
		user_handle: z.string().min(1, { message: 'User Handle is required' }),
		password: z.string().min(1, { message: 'Password is required' }),
	});

	const {
		control,
		handleSubmit,
		formState: { errors, touchedFields },
	} = useForm({
		mode: 'onBlur',
		resolver: zodResolver(schema),
		defaultValues: {
			user_handle: '',
			password: '',
		},
	});

	const onSubmit = (data: ILoginPayload) => {
		setIsLoading(true);
		login(data.user_handle, data.password)
			.then((res) => {
				router.navigate('/main');
			})
			.catch((err) => {
				setFormError(err?.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<ThemedSafeAreaView style={styles.container}>
				<ThemedText type="title" style={styles.title}>
					Login
				</ThemedText>

				{formError && (
					<ThemedText style={styles.formError}>
						{formError}
					</ThemedText>
				)}

				<View style={styles.inputsContainer}>
					<Controller
						name="user_handle"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value } }) => (
							<ThemedTextInput
								label="User Handle"
								placeholder="Enter your user handle"
								error={errors.user_handle?.message}
								touched={touchedFields.user_handle}
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								autoCapitalize="none"
							/>
						)}
					/>

					<Controller
						name="password"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value } }) => (
							<ThemedTextInput
								label="Password"
								placeholder="Enter your password"
								error={errors.password?.message}
								touched={touchedFields.password}
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								textContentType="password"
								secureTextEntry
								autoCapitalize="none"
							/>
						)}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<ThemedButton
						label="Login"
						onPress={handleSubmit(onSubmit)}
						loading={isLoading}
					/>
				</View>
			</ThemedSafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 15,
		gap: 30,
	},
	title: {
		textAlign: 'center',
	},
	inputsContainer: {
		gap: 10,
		width: '100%',
	},
	buttonContainer: {
		width: '100%',
	},
	formError: {
		textAlign: 'center',
		color: 'red',
	},
});
