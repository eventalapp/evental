import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { NotificationPreferencesScreen } from '../../screens/settings/NotificationPreferences';
import { SettingsScreen } from '../../screens/settings/Settings';

const Stack = createStackNavigator();

export type SettingsStackParamList = {
	Settings: undefined;
	NotificationPreferences: undefined;
};

export const SettingStackNavigation = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Settings">
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
		</Stack.Navigator>
	);
};
