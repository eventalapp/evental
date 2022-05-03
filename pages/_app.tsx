import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';
import 'nprogress/nprogress.css';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ReactTooltip from 'react-tooltip';

config.autoAddCss = false;

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps & { error?: Error }> = (props) => {
	const { Component, pageProps, error } = props;
	const [queryClient] = useState(() => new QueryClient());
	const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<Component {...pageProps} error={error} />
			</Hydrate>

			{isMounted ? <ReactTooltip backgroundColor="#000000" effect="solid" /> : null}

			<ToastContainer />
			<ReactQueryDevtools />
			<style jsx global>{`
				#__next {
					height: 100%;
				}
			`}</style>
		</QueryClientProvider>
	);
};

export default App;
