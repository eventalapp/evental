import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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

import { useSession } from '@eventalapp/shared/hooks/queries/useSession';
import { formatDateRange } from '@eventalapp/shared/utils/date';

export function ViewSessionScreen({ route, navigation }) {
	const { eid, sid } = route.params || {};
	const safeAreaInsets = useSafeAreaInsets();

	const {
		data: session,
		refetch: refetchSession,
		isLoading: isSessionLoading
	} = useSession({ eid, sid });

	return (
		<>
			<ScrollView
				refreshControl={
					<RefreshControl
						colors={['#000000']}
						tintColor="#000000"
						refreshing={isSessionLoading}
						onRefresh={() => {
							refetchSession();
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
							<Text>{JSON.stringify(session)}</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</>
	);
}
