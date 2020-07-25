import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Pressable, RefreshControl, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNotificationPreferences, useUser } from '@eventalapp/shared/hooks';

import { NotificationPreferencesForm } from '../../components/form/NotificationPreferenceForm';
import { SettingsStackParamList } from '../../components/navigation/SettingsStackNavigation';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';

type Props = StackScreenProps<SettingsStackParamList, 'NotificationPreferences'>;

export const NotificationPreferencesScreen = (props: Props) => {
	const { navigation } = props;
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
						void refetchPreferences();
						void refetchUser();
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
