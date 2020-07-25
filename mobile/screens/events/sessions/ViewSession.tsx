import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@eventalapp/shared/hooks';
import { formatDateRange } from '@eventalapp/shared/utils';

import { EventsStackParamList } from '../../../components/navigation/EventStackNavigation';

type Props = StackScreenProps<EventsStackParamList, 'ViewSession'>;

export const ViewSessionScreen = (props: Props) => {
	const { route, navigation } = props;
	const { eid, sid } = route.params || {};
	const safeAreaInsets = useSafeAreaInsets();

	const {
		data: session,
		refetch: refetchSession,
		isRefetching: isSessionRefetching,
		isLoading: isSessionLoading
	} = useSession({ eid, sid });

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					colors={['#000000']}
					tintColor="#000000"
					refreshing={isSessionRefetching || isSessionLoading}
					onRefresh={() => {
						void refetchSession();
					}}
				/>
			}
		>
			<View
				style={{
					flexDirection: 'column',
					alignItems: 'flex-start',
					paddingTop: safeAreaInsets.top + 28,
					paddingBottom: 12,
					paddingLeft: safeAreaInsets.left + 28,
					paddingRight: safeAreaInsets.right + 28
				}}
			>
				<Pressable
					onPress={() => {
						navigation.goBack();
					}}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
						marginBottom: 8
					}}
				>
					<FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 6 }} />
					<Text>Back</Text>
				</Pressable>

				{session && (
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 20
							}}
						>
							<View style={{ display: 'flex', flexDirection: 'column' }}>
								<Text
									style={{
										fontSize: 24,
										fontWeight: 'bold',
										marginBottom: 4
									}}
								>
									{session.name}
								</Text>
								<Text>
									{formatDateRange(new Date(session.startDate), new Date(session.endDate))}
								</Text>
							</View>
						</View>

						{session.description && session.description.length > 0 && (
							<Text>{session.description}</Text>
						)}

						{session.roleMembers && session.roleMembers.length > 0 && (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									marginTop: 12,
									marginBottom: 12
								}}
							>
								{session.roleMembers.map((roleMember) => (
									<Pressable
										style={{
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: 'white',
											padding: 12,
											borderRadius: 8
										}}
										key={roleMember.id}
										onPress={() =>
											navigation.navigate('ViewAttendee', {
												eid: eid,
												uid: roleMember.attendee.user.slug
											})
										}
									>
										<Image
											source={{
												uri: `https://cdn.evental.app${roleMember.attendee.user.image}`,
												width: 52,
												height: 52
											}}
											style={{
												backgroundColor: '#dedede',
												borderRadius: 8,
												marginBottom: 10
											}}
										/>

										<Text
											style={{
												fontSize: 18,
												fontWeight: 'bold'
											}}
										>
											{roleMember.attendee.user.name}
										</Text>
									</Pressable>
								))}
							</View>
						)}

						<Text>{JSON.stringify(session)}</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
};
