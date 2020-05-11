import type { AppProps } from 'next/app';
import React, { useState } from 'react';
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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DefaultSeo } from 'next-seo';

dayjs.extend(utc);
dayjs.extend(timezone);

config.autoAddCss = false;

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps & { error?: Error }> = (props) => {
	const { Component, pageProps, error } = props;
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<DefaultSeo
					openGraph={{
						type: 'website',
						locale: 'en_IE',
						url: 'https://evental.app',
						site_name: 'Evental',
						images: [
							{
								url: 'https://cdn.evental.app/images/logo.jpg',
								width: 389,
								height: 389,
								alt: 'Evental Logo Alt',
								type: 'image/jpeg'
							}
						]
					}}
					twitter={{
						handle: '@jrkcodes',
						site: '@eventaldotapp',
						cardType: 'summary'
					}}
				/>
				<Component {...pageProps} error={error} />
			</Hydrate>

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
