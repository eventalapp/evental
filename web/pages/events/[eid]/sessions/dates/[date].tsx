import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useEvent, useIsOrganizer, useSessionsByDate } from '@eventalapp/shared/hooks';

import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { Footer } from '../../../../../components/layout/Footer';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { SessionList } from '../../../../../components/sessions/SessionList';

const ViewSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { date, eid } = router.query;
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: sessionsByDate } = useSessionsByDate({ eid: String(eid), date: String(date) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && (
		<NextSeo
			title={`${dayjs(String(date)).startOf('day').tz(event.timeZone).format('MMMM D')} — ${
				event.name
			}`}
			description={`View all of the sessions for ${dayjs(String(date))
				.startOf('day')
				.tz(event.timeZone)
				.format('YYYY/MM/DD')} at ${event.name}`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/sessions/dates/${date}`,
				title: `${dayjs(String(date)).startOf('day').tz(event.timeZone).format('YYYY/MM/DD')} — ${
					event.name
				}`,
				description: `View all of the sessions for ${dayjs(String(date))
					.startOf('day')
					.tz(event.timeZone)
					.format('YYYY/MM/DD')} at ${event.name}`,
				images: [
					{
						url: `https://cdn.evental.app${event.image}`,
						width: 300,
						height: 300,
						alt: `${event.name} Logo Alt`,
						type: 'image/jpeg'
					}
				]
			}}
		/>
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<FlexRowBetween>
						<Heading>
							{event ? (
								dayjs(String(date)).startOf('day').tz(event.timeZone).format('MMMM D')
							) : (
								<Skeleton className="w-48" />
							)}
						</Heading>
					</FlexRowBetween>

					<SessionList sessions={sessionsByDate} event={event} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewSessionCategoryPage;
