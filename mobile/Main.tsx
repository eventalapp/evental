import NetInfo from '@react-native-community/netinfo';
import { registerRootComponent } from 'expo';
import * as React from 'react';
import { AppState, AppStateStatus, Platform, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from 'react-query';

import { Navigation } from './components/navigation';

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== 'web') {
		focusManager.setFocused(status === 'active');
	}
}

onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(!!state.isConnected);
	});
});

export function Main() {
	const queryClient = new QueryClient();

	React.useEffect(() => {
		const subscription = AppState.addEventListener('change', onAppStateChange);

		return () => subscription.remove();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar barStyle="dark-content" />

			<Navigation />
		</QueryClientProvider>
	);
}

registerRootComponent(Main);
