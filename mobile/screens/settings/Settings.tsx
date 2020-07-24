import React from 'react';
import { Button, RefreshControl, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@eventalapp/shared/hooks/queries/useUser';

export function SettingsScreen({ navigation }) {
	const safeAreaInsets = useSafeAreaInsets();
	const {
		data: user,
		refetch: refetchUser,
		isRefetching: isUserRefetching,
		isLoading: isUserLoading
	} = useUser();

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
					refreshing={isUserRefetching || isUserLoading}
					onRefresh={() => {
						refetchUser();
					}}
				/>
			}
		>
			<Text
				style={{
					fontSize: 36,
					fontWeight: 'bold',
					marginBottom: 18
				}}
			>
				Settings
			</Text>

			<Text>{user && JSON.stringify(user)}</Text>

			<Button
				title="Notification Preferences"
				onPress={() => {
					navigation.navigate('NotificationPreferences');
				}}
			></Button>
		</ScrollView>
	);
}
