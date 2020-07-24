import React from 'react';
import {
	Button,
	FlatList,
	Image,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAttendee } from '@eventalapp/shared/hooks/queries/useAttendee';
import { useEvent } from '@eventalapp/shared/hooks/queries/useEvent';
import { useSessions } from '@eventalapp/shared/hooks/queries/useSessions';

export function ViewAttendeeScreen({ route, navigation }) {
	const { eid, uid } = route.params || {};
	const safeAreaInsets = useSafeAreaInsets();

	console.log(eid);

	const {
		data: event,
		refetch: refetchEvent,
		isRefetching: isEventRefetching,
		isLoading: isEventLoading
	} = useEvent({ eid });
	const {
		data: attendee,
		refetch: refetchAttendee,
		isRefetching: isAttendeeRefetching,
		isLoading: isAttendeeLoading
	} = useAttendee({ eid, uid });

	return (
		<>
			<ScrollView
				refreshControl={
					<RefreshControl
						colors={['#000000']}
						tintColor="#000000"
						refreshing={
							isEventRefetching || isAttendeeRefetching || isAttendeeLoading || isEventLoading
						}
						onRefresh={() => {
							refetchEvent();
							refetchAttendee();
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
					{attendee && (
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
									source={{
										uri: `https://cdn.evental.app${attendee.user.image}`,
										width: 52,
										height: 52
									}}
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
										{attendee.user.name}
									</Text>
								</View>
							</View>
						</View>
					)}

					{attendee?.user?.description && attendee.user.description.length > 0 && (
						<Text>{attendee.user.description}</Text>
					)}

					<View>{attendee && <Text>{JSON.stringify(attendee)}</Text>}</View>
				</View>
			</ScrollView>
		</>
	);
}
