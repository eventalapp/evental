import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useEditNotificationPreferences } from '@eventalapp/shared/hooks';
import {
	FullUser,
	NotificationPreferencePayload,
	NotificationPreferenceSchema,
	colors
} from '@eventalapp/shared/utils';

type Props = {
	preferences?: Prisma.NotificationPreference;
	user?: FullUser;
};

export const NotificationPreferencesForm: React.FC<Props> = (props) => {
	const { preferences } = props;

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<NotificationPreferencePayload>({
		resolver: zodResolver(NotificationPreferenceSchema),
		defaultValues: {
			event: preferences?.event ?? false,
			marketing: preferences?.marketing ?? false,
			news: preferences?.news ?? false
		}
	});

	const { mutate: editNotificationPreferences, isLoading: isEditNotificationPreferencesLoading } =
		useEditNotificationPreferences({
			onSuccess: () => {
				Alert.alert(
					'Preferences Updated',
					'Your user notification preferences have successfully been updated.',
					[{ text: 'OK' }]
				);
			},
			onError: (error) => {
				Alert.alert('Error', error?.message, [{ text: 'OK' }]);
			}
		});

	return (
		<View>
			<View style={{ marginBottom: 16 }}>
				<Text style={{ marginBottom: 8, fontSize: 16 }}>Event Notifications</Text>

				<Controller
					control={control}
					render={({ field: { onChange, value } }) => (
						<Switch
							thumbColor={colors.white.DEFAULT}
							trackColor={{ true: colors.primary[500], false: colors.gray[200] }}
							onValueChange={onChange}
							value={value}
						/>
					)}
					name="event"
				/>

				{errors?.event?.message && <Text style={styles.error}>{errors?.event?.message}</Text>}
			</View>
			<View style={{ marginBottom: 16 }}>
				<Text style={{ marginBottom: 8, fontSize: 16 }}>News Notifications</Text>

				<Controller
					control={control}
					render={({ field: { onChange, value } }) => (
						<Switch
							thumbColor={colors.white.DEFAULT}
							trackColor={{ true: colors.primary[500], false: colors.gray[200] }}
							onValueChange={onChange}
							value={value}
						/>
					)}
					name="news"
				/>

				{errors?.news?.message && <Text style={styles.error}>{errors?.news?.message}</Text>}
			</View>
			<View style={{ marginBottom: 16 }}>
				<Text style={{ marginBottom: 8, fontSize: 16 }}>Marketing Notifications</Text>

				<Controller
					control={control}
					render={({ field: { onChange, value } }) => (
						<Switch
							thumbColor={colors.white.DEFAULT}
							trackColor={{ true: colors.primary[500], false: colors.gray[200] }}
							onValueChange={onChange}
							value={value}
						/>
					)}
					name="marketing"
				/>

				{errors?.marketing?.message && (
					<Text style={styles.error}>{errors?.marketing?.message}</Text>
				)}
			</View>
			<Pressable
				onPress={handleSubmit((data) => {
					editNotificationPreferences(data);
				})}
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignSelf: 'flex-end',
					marginBottom: 8,
					paddingHorizontal: 20,
					paddingVertical: 12,
					borderRadius: 8,
					backgroundColor: colors.primary[500]
				}}
			>
				{isEditNotificationPreferencesLoading ? (
					<Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: '700' }}>Loading...</Text>
				) : (
					<Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: '700' }}>Save</Text>
				)}
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	error: {
		marginBottom: 20,
		height: 17.5
	}
});
