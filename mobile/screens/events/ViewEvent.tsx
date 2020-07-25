import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEvent, useSessions, useVenues } from '@eventalapp/shared/hooks';

import { EventsStackParamList } from '../../components/navigation/EventStackNavigation';

type Props = StackScreenProps<EventsStackParamList, 'ViewEvent'>;

export const ViewEventScreen = (props: Props) => {
	const { route, navigation } = props;
	const { eid } = route.params || {};
	const safeAreaInsets = useSafeAreaInsets();

	const {
		data: event,
		refetch: refetchEvent,
		isRefetching: isEventRefetching,
		isLoading: isEventLoading
	} = useEvent({ eid });
	const {
		data: sessions,
		refetch: refetchSessions,
		isRefetching: isSessionsRefetching,
		isLoading: isSessionsLoading
	} = useSessions({ eid });
	const {
		data: venues,
		refetch: refetchVenues,
		isRefetching: isVenuesRefetching,
		isLoading: isVenuesLoading
	} = useVenues({ eid });

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					colors={['#000000']}
					tintColor="#000000"
					refreshing={
						isEventRefetching ||
						isSessionsRefetching ||
						isSessionsLoading ||
						isVenuesLoading ||
						isEventLoading
					}
					onRefresh={() => {
						void refetchEvent();
						void refetchSessions();
					}}
				/>
			}
		>
			<View
				style={{
					flexDirection: 'column',
					justifyContent: 'center',
					paddingTop: safeAreaInsets.top + 28,
					paddingLeft: safeAreaInsets.left + 28,
					paddingRight: safeAreaInsets.right + 28
				}}
			>
				{event && (
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 20
							}}
						>
							<Image
								source={{ uri: `https://cdn.evental.app${event.image}`, width: 52, height: 52 }}
								style={{
									backgroundColor: '#dedede',
									borderRadius: 8,
									marginRight: 10
								}}
							/>
							<View style={{ display: 'flex', flexDirection: 'column' }}>
								<Text
									style={{
										fontSize: 24,
										fontWeight: 'bold',
										marginBottom: 4
									}}
								>
									{event.name}
								</Text>
								<Text>
									{new Date(event.startDate).toLocaleDateString([], {
										month: 'short',
										day: 'numeric'
									})}{' '}
									–{' '}
									{new Date(event.endDate).toLocaleDateString([], {
										month: 'short',
										day: 'numeric'
									})}
								</Text>
							</View>
						</View>
					</View>
				)}
			</View>
			<View
				style={{
					flexDirection: 'column',
					justifyContent: 'center',
					paddingTop: 12,
					paddingBottom: 12,
					paddingLeft: safeAreaInsets.left + 28,
					paddingRight: safeAreaInsets.right + 28
				}}
			>
				{sessions &&
					sessions.map((session) => (
						<Pressable
							key={session.id}
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
								backgroundColor: 'white',
								paddingVertical: 12,
								paddingStart: 12,
								paddingEnd: 18,
								borderRadius: 8,
								flex: 1,
								marginBottom: 12
							}}
							onPress={() => navigation.navigate('ViewSession', { eid, sid: session.id })}
						>
							<View
								style={{
									width: 20,
									height: 20,
									borderRadius: 100,
									marginRight: 12,
									backgroundColor: session?.category?.color ?? '#888888'
								}}
							/>

							<View
								style={{
									flexDirection: 'column'
								}}
							>
								<Text
									style={{
										fontSize: 18,
										fontWeight: 'bold',
										marginBottom: 4
									}}
								>
									{session.name}
								</Text>

								{session.roleMembers.length >= 1 && (
									<Text style={{}}>
										{session.roleMembers
											.map((member) => member.attendee.user.name)
											.splice(0, 3)
											.join(', ')}
									</Text>
								)}
							</View>
						</Pressable>
					))}

				{venues && <Text>{JSON.stringify(venues)}</Text>}
				{event && <Text>{JSON.stringify(event)}</Text>}
			</View>
		</ScrollView>
	);
};
