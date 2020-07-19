import { faCalendar, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import NetInfo from '@react-native-community/netinfo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import * as Linking from 'expo-linking';
import * as React from 'react';
import { AppState, AppStateStatus, Platform, StatusBar, Text } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from 'react-query';

import { EventsScreen } from './screens/Events';
import { SettingsScreen } from './screens/Settings';
import { SignInScreen } from './screens/SignIn';
import { ViewEventScreen } from './screens/ViewEvent';

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
const prefix = Linking.createURL('/');

export function Main() {
	const queryClient = new QueryClient();

	const config = {
		screens: {
			Events: { path: 'events' },
			ViewEvent: {
				path: 'events/:eid',
				parse: {
					eid: (eid: string) => {
						return String(eid);
					}
				}
			}
		}
	};

	const linking = {
		prefixes: [prefix, 'https://evental.app'],
		config
	};

	React.useEffect(() => {
		const subscription = AppState.addEventListener('change', onAppStateChange);

		return () => subscription.remove();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar barStyle="dark-content" />
			<NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
				<Tab.Navigator
					screenOptions={{
						headerShown: false
					}}
					initialRouteName="Events"
				>
					<Tab.Screen
						name="ViewEvent"
						component={ViewEventScreen}
						options={{
							tabBarButton: () => null
						}}
					/>
					<Tab.Screen
						name="Events"
						component={EventsScreen}
						options={{
							tabBarLabel: 'Events',
							tabBarIcon: ({ color, size }) => (
								<FontAwesomeIcon icon={faCalendar} size={size} color={color} />
							)
						}}
					/>
					<Tab.Screen
						name="Settings"
						component={SettingsScreen}
						options={{
							tabBarLabel: 'Settings',
							tabBarIcon: ({ color, size }) => (
								<FontAwesomeIcon icon={faCog} size={size} color={color} />
							)
						}}
					/>
					<Tab.Screen
						name="Sign In"
						component={SignInScreen}
						options={{
							tabBarLabel: 'Sign In',
							tabBarIcon: ({ color, size }) => (
								<FontAwesomeIcon icon={faUser} size={size} color={color} />
							)
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</QueryClientProvider>
	);
}

registerRootComponent(Main);
