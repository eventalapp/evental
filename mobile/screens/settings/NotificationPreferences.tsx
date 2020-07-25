import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
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

import { NotificationPreferencesForm } from '../../components/form/NotificationPreferenceForm';
import { SettingsStackParamList } from '../../components/navigation/SettingsStackNavigation';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';

type Props = StackScreenProps<SettingsStackParamList, 'NotificationPreferences'>;

export const NotificationPreferencesScreen = ({ navigation }: Props) => {
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

			{preferences && user && <NotificationPreferencesForm preferences={preferences} user={user} />}
		</ScrollView>
	);
};
