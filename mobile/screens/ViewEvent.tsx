import React from 'react';
import { Button, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEvent } from '@eventalapp/shared/hooks/queries/useEvent';

export function ViewEventScreen({ route, navigation }) {
	const { eid } = route.params || {};
	const safeAreaInsets = useSafeAreaInsets();

	console.log(eid);

	const { data: event } = useEvent({ eid });

	return (
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
								marginEnd: 8
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
	);
}
