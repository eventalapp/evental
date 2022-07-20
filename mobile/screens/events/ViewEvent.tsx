import React from 'react';
import { Button, FlatList, Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEvent } from '@eventalapp/shared/hooks/queries/useEvent';
import { useSessions } from '@eventalapp/shared/hooks/queries/useSessions';

export function ViewEventScreen({ route, navigation }) {
	const { eid } = route.params || {};
	const safeAreaInsets = useSafeAreaInsets();

	console.log(eid);

	const { data: event, refetch: refetchEvent, isLoading: isEventLoading } = useEvent({ eid });
	const {
		data: sessions,
		refetch: refetchSessions,
		isLoading: isSessionsLoading
	} = useSessions({ eid });

	return (
		<>
			<ScrollView
				refreshControl={
					<RefreshControl
						colors={['#000000']}
						tintColor="#000000"
						refreshing={isEventLoading || isSessionsLoading}
						onRefresh={() => {
							refetchEvent();
							refetchSessions();
						}}
					/>
				}
			>
				<View
					style={{
						flexDirection: 'column',
						justifyContent: 'center',
						paddingTop: safeAreaInsets.top + 28,
						paddingBottom: 12,
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
											fontWeight: 'bold'
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
							<Text>{JSON.stringify(event)}</Text>
						</View>
					)}
				</View>
				<View>
					<FlatList
						contentContainerStyle={{
							flexDirection: 'column',
							justifyContent: 'center',
							paddingTop: safeAreaInsets.top + 28,
							paddingBottom: 12,
							paddingLeft: safeAreaInsets.left + 28,
							paddingRight: safeAreaInsets.right + 28
						}}
						data={sessions}
						renderItem={({ item: session }) => (
							<View
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
											fontWeight: 'bold'
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
								<Button
									title="view"
									onPress={() => navigation.navigate('ViewSession', { eid, sid: session.id })}
								></Button>
							</View>
						)}
					/>
				</View>
			</ScrollView>
		</>
	);
}
