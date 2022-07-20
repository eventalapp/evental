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

import { useUpcomingEvents } from '@eventalapp/shared/hooks/queries/useUpcomingEvents';

import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';

export function UpcomingEventsScreen(props) {
	const { navigation } = props;
	const {
		data: upcomingEvents,
		refetch: refetchUpcomingEvents,
		isLoading: isUpcomingEventLoading
	} = useUpcomingEvents();
	useRefreshOnFocus(refetchUpcomingEvents);
	const safeAreaInsets = useSafeAreaInsets();

	return (
		<FlatList
			refreshControl={
				<RefreshControl
					colors={['#000000']}
					tintColor="#000000"
					refreshing={isUpcomingEventLoading}
					onRefresh={() => {
						refetchUpcomingEvents();
					}}
				/>
			}
			contentContainerStyle={{
				flexDirection: 'column',
				justifyContent: 'center',
				paddingTop: safeAreaInsets.top + 28,
				paddingBottom: 12,
				paddingLeft: safeAreaInsets.left + 28,
				paddingRight: safeAreaInsets.right + 28
			}}
			ListHeaderComponent={() => (
				<Text
					style={{
						fontSize: 36,
						fontWeight: 'bold',
						marginBottom: 18
					}}
				>
					All Events
				</Text>
			)}
			data={upcomingEvents}
			renderItem={({ item }) => (
				<Pressable
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
					onPress={() => navigation.navigate('ViewEvent', { eid: item.slug })}
				>
					<Image
						source={{ uri: `https://cdn.evental.app${item.image}`, width: 52, height: 52 }}
						style={{
							backgroundColor: '#dedede',
							borderRadius: 8,
							marginEnd: 10
						}}
					/>

					<View
						style={{
							flexDirection: 'column'
						}}
					>
						<View
							style={{
								flexDirection: 'row'
							}}
						>
							<Text
								style={{
									fontSize: 14,
									marginEnd: 4,
									textTransform: 'uppercase'
								}}
							>
								{item.category} &middot;{' '}
								{new Date(item.startDate).toLocaleDateString([], {
									month: 'short',
									day: 'numeric'
								})}{' '}
								–{' '}
								{new Date(item.endDate).toLocaleDateString([], {
									month: 'short',
									day: 'numeric'
								})}
							</Text>
						</View>

						<Text
							style={{
								fontSize: 18,
								fontWeight: 'bold'
							}}
						>
							{item.name}
						</Text>
					</View>
				</Pressable>
			)}
		/>
	);
}