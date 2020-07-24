import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { SettingsScreen } from '../screens/Settings';

const Stack = createStackNavigator();

export const SettingStackNavigation = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Settings">
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
};
