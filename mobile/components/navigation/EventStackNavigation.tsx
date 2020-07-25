import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { UpcomingEventsScreen } from '../../screens/events/UpcomingEvents';
import { ViewEventScreen } from '../../screens/events/ViewEvent';
import { ViewAttendeeScreen } from '../../screens/events/attendees/ViewAttendee';
import { ViewSessionScreen } from '../../screens/events/sessions/ViewSession';

const Stack = createStackNavigator();

export type EventsStackParamList = {
	Events: undefined;
	ViewEvent: { eid: string };
	ViewAttendee: { eid: string; uid: string };
	ViewSession: { eid: string; sid: string };
};

export const EventStackNavigation = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Events">
			<Stack.Screen name="Events" component={UpcomingEventsScreen} />
			<Stack.Screen name="ViewEvent" component={ViewEventScreen} />
			<Stack.Screen name="ViewAttendee" component={ViewAttendeeScreen} />
			<Stack.Screen name="ViewSession" component={ViewSessionScreen} />
		</Stack.Navigator>
	);
};
