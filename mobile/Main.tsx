import NetInfo from '@react-native-community/netinfo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { AppState, AppStateStatus, Platform, StatusBar } from 'react-native';
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from 'react-query';

import { registerRootComponent } from 'expo';
import { EventsScreen } from './src/screens/Events';
import { SettingsScreen } from './src/screens/Settings';

import 'dotenv/config';

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== 'web') {
		focusManager.setFocused(status === 'active');
	}
}

onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(!!state.isConnected);
	});
});

const Tab = createBottomTabNavigator();

	export function Main() {
	const queryClient = new QueryClient();
	React.useEffect(() => {
		const subscription = AppState.addEventListener('change', onAppStateChange);

		return () => subscription.remove();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<NavigationContainer>
				<StatusBar barStyle="dark-content" />

				<Tab.Navigator>
					<Tab.Screen name="Events" component={EventsScreen} />
					<Tab.Screen name="Settings" component={SettingsScreen} />
				</Tab.Navigator>
			</NavigationContainer>
		</QueryClientProvider>
	);
}

registerRootComponent(Main);
