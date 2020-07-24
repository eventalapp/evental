import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEditNotificationPreferences } from '@eventalapp/shared/hooks/mutations/useEditNotificationPreferences';
import { useNotificationPreferences } from '@eventalapp/shared/hooks/queries/useNotificationPreferences';
import { useUser } from '@eventalapp/shared/hooks/queries/useUser';
import { colors } from '@eventalapp/shared/utils/color';
import {
	NotificationPreferencePayload,
	NotificationPreferenceSchema
} from '@eventalapp/shared/utils/schema';

import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';

export function NotificationPreferencesScreen({ navigation }) {
	const safeAreaInsets = useSafeAreaInsets();

	const {
		data: user,
		refetch: refetchUser,
		isRefetching: isUserRefetching,
		isLoading: isUserLoading
	} = useUser();
	const {
		data: preferences,
		refetch: refetchPreferences,
		isRefetching: isPreferencesRefetching,
		isLoading: isPreferencesLoading
	} = useNotificationPreferences();

	useRefreshOnFocus(refetchPreferences);

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<NotificationPreferencePayload>({
		resolver: zodResolver(NotificationPreferenceSchema),
		defaultValues: {
			event: preferences?.event,
			marketing: preferences?.marketing,
			news: preferences?.news
		}
	});

	const { mutate: editNotificationPreferences } = useEditNotificationPreferences();

	return (
		<ScrollView
			contentContainerStyle={{
				flexDirection: 'column',
				justifyContent: 'center',
				paddingTop: safeAreaInsets.top + 28,
				paddingLeft: safeAreaInsets.left + 28,
				paddingRight: safeAreaInsets.right + 28
			}}
			refreshControl={
				<RefreshControl
					colors={['#000000']}
					tintColor="#000000"
					refreshing={
						isUserRefetching || isPreferencesRefetching || isUserLoading || isPreferencesLoading
					}
					onRefresh={() => {
						refetchPreferences();
						refetchUser();
					}}
				/>
			}
		>
			<Pressable
				onPress={() => {
					navigation.goBack();
				}}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					marginBottom: 8
				}}
			>
				<FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 6 }} />
				<Text>Back</Text>
			</Pressable>
			<Text
				style={{
					fontSize: 36,
					fontWeight: 'bold',
					marginBottom: 18
				}}
			>
				Preferences
			</Text>

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
				<Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: '700' }}>Save</Text>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	error: {
		marginBottom: 20,
		height: 17.5
	}
});
