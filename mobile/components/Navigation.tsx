import { faCalendar, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as React from 'react';
import { Text } from 'react-native';

import { useUser } from '@eventalapp/shared/hooks/queries/useUser';

import { SettingsScreen } from '../screens/Settings';
import { SignInScreen } from '../screens/SignIn';
import { UpcomingEventsScreen } from '../screens/events/UpcomingEvents';
import { ViewEventScreen } from '../screens/events/ViewEvent';
import { ViewSessionScreen } from '../screens/events/sessions/ViewSession';

const Tab = createBottomTabNavigator();
const prefix = Linking.createURL('/');

export const Navigation = () => {
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
			},
			ViewSessions: {
				path: 'events/:eid/sessions/:sid',
				parse: {
					eid: (eid: string) => {
						return String(eid);
					},
					sid: (sid: string) => {
						return String(sid);
					}
				}
			}
		}
	};

	const linking = {
		prefixes: [prefix, 'https://evental.app'],
		config
	};

	const { data: user, refetch: refetchUser, isLoading: isUserLoading } = useUser();

	return (
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
					name="ViewSession"
					component={ViewSessionScreen}
					options={{
						tabBarButton: () => null
					}}
				/>
				<Tab.Screen
					name="Events"
					component={UpcomingEventsScreen}
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
					name="SignIn"
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
	);
};
