import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

				<ToastContainer />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default App;
