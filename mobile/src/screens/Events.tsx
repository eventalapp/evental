import React from 'react';
import { FlatList, Image, ListView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUpcomingEventsQuery } from '../../../shared/useUpcomingEventsQuery';

export function EventsScreen() {
	const { upcomingEvents } = useUpcomingEventsQuery();
	const safeAreaInsets = useSafeAreaInsets();

	return (
		<FlatList
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
					<Image
						source={{ uri: `https://cdn.evental.app${item.image}`, width: 52, height: 52 }}
						style={{
							backgroundColor: '#dedede',
							borderRadius: 8,
							marginEnd: 8
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
				</View>
			)}
		/>
	);
}
