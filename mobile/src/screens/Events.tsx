import React from 'react';
import { Text, View } from 'react-native';

import { useUpcomingEventsQuery } from '../../../shared/useUpcomingEventsQuery';

export function EventsScreen() {
	const { upcomingEvents } = useUpcomingEventsQuery();

	console.log(upcomingEvents);

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Events!</Text>
		</View>
	);
}
