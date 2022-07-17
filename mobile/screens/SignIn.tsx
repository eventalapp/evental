import { useSignInMutation } from '@eventalapp/shared/hooks/mutations/useSignInMutation';
import { useUser } from '@eventalapp/shared/hooks/queries/useUser';
import { SignInPayload, SignInSchema } from '@eventalapp/shared/utils/schema';
import { text } from '@fortawesome/fontawesome-svg-core';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SignInScreen() {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<SignInPayload>({
		resolver: zodResolver(SignInSchema)
	});

	const { data: user } = useUser();
	const { signInMutation } = useSignInMutation();

	console.log(user);

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
						<TextInput
							style={styles.input}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							textContentType="password"
						/>
					)}
					name="password"
				/>

				{errors?.password?.message && <Text style={styles.error}>{errors?.password?.message}</Text>}
			</View>

			<Button
				title="Submit"
				onPress={handleSubmit((data) => {
					signInMutation.mutate(data);
				})}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 15,
		position: 'relative'
	},
	input: {
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
