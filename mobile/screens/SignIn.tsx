import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSignIn, useUser } from '@eventalapp/shared/hooks';
import { SignInPayload, SignInSchema } from '@eventalapp/shared/utils';

export const SignInScreen = () => {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<SignInPayload>({
		resolver: zodResolver(SignInSchema)
	});

	const [passwordHide, setPasswordHide] = useState(true);

	const {
		data: user,
		refetch: refetchUser,
		isRefetching: isUserRefetching,
		isLoading: isUserLoading
	} = useUser();
	const { mutate: signIn } = useSignIn({
		onError: (error) => {
			Alert.alert('Error', error?.message, [{ text: 'OK' }]);
		},
		onSuccess: () => {
			Alert.alert('Sign In', 'You have successfully signed in.', [{ text: 'OK' }]);
		}
	});

	return (
		<View style={styles.container}>
			<Text
				style={{
					fontSize: 36,
					fontWeight: 'bold',
					marginBottom: 18
				}}
			>
				Sign In
			</Text>

			<Text>{JSON.stringify(user)}</Text>

			<View style={styles.inputContainer}>
				<Text>Email</Text>

				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={styles.input}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							textContentType="emailAddress"
						/>
					)}
					name="email"
				/>

				{errors?.email?.message && <Text style={styles.error}>{errors?.email?.message}</Text>}
			</View>

			<View style={styles.inputContainer}>
				<Text>Password</Text>
				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.input}>
							<TextInput
								secureTextEntry={passwordHide}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								textContentType="password"
								style={{ flex: 1 }}
							/>
							<Icon
								style={{ marginTop: 10 }}
								name={passwordHide ? 'eye-off' : 'eye'}
								size={20}
								onPress={() => setPasswordHide(!passwordHide)}
							/>
						</View>
					)}
					name="password"
				/>

				{errors?.password?.message && <Text style={styles.error}>{errors?.password?.message}</Text>}
			</View>

			<Button
				title="Submit"
				onPress={handleSubmit((data) => {
					signIn(data);
				})}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 15,
		position: 'relative'
	},
	input: {
		flexDirection: 'row',
		height: 40,
		width: 300,
		paddingHorizontal: 5,
		backgroundColor: 'white',
		marginBottom: 5
	},
	inputContainer: {
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4
	},
	error: {
		marginBottom: 20,
		height: 17.5
	}
});
