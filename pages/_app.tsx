import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import '../styles/tailwind.css';

const App: React.FC<AppProps & { err?: Error }> = (props) => {
	const { Component, pageProps, err } = props;
	const [queryClient] = useState(() => new QueryClient());

	return (
		<SessionProvider session={pageProps.session}>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<Component {...pageProps} err={err} />
				</Hydrate>

				<ReactQueryDevtools />
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default App;
