import React from 'react';
import { Text, View } from 'react-native';

export function ViewEventScreen() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text
				style={{
					fontSize: 36,
					fontWeight: 'bold',
					marginBottom: 18
				}}
			>
				All Events
			</Text>
		</View>
	);
}
