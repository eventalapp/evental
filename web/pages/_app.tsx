import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { Router, useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React, { useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/global.css';
import { theme } from '../tailwind.config';
import { pageView } from '../utils/analytics';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

config.autoAddCss = false;

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps & { error?: Error }> = (props) => {
	const { Component, pageProps, error } = props;
	const [queryClient] = useState(() => new QueryClient());
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: URL) => {
			pageView(url);
		};

		router.events.on('routeChangeComplete', handleRouteChange);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<DefaultSeo
					additionalLinkTags={[
						{
							rel: 'preconnect',
							href: 'https://fonts.googleapis.com'
						},
						{
							rel: 'preconnect',
							href: 'https://fonts.gstatic.com'
						},
						{
							href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
							rel: 'stylesheet'
						},
						{
							rel: 'shortcut icon',
							href: '/images/favicon.ico',
							type: 'image/x-icon'
						}
					]}
					openGraph={{
						type: 'website',
						locale: 'en_IE',
						url: 'https://evental.app',
						site_name: 'Evental — Event management software from the future',
						description:
							"Event management software that's highly intuitive. Your attendees and organizers will love using Evental for your in-person, hybrid, and virtual events.",
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
				<SkeletonTheme
					baseColor={theme.extend.colors.gray[100]}
					highlightColor={theme.extend.colors.gray[200]}
				>
					<Component {...pageProps} error={error} />
				</SkeletonTheme>
			</Hydrate>

			<ToastContainer className="pointer-events-auto" />

			<ReactQueryDevtools />

			<style>{`
				#__next {
					height: 100%;
				}
			`}</style>
		</QueryClientProvider>
	);
};

export default App;
