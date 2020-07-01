import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Footer } from '../../../../../components/Footer';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { Heading } from '../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionsByDateQuery } from '../../../../../hooks/queries/useSessionsByDateQuery';

const ViewSessionTypePage: NextPage = () => {
	const router = useRouter();
	const { date, eid } = router.query;
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionsByDateData } = useSessionsByDateQuery(String(eid), String(date));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && (
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
						title: `${dayjs(String(date))
							.startOf('day')
							.tz(event.timeZone)
							.format('YYYY/MM/DD')} — ${event.name}`,
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
			)}

			<EventNavigation eid={String(eid)} />

			<Column>
				<FlexRowBetween>
					<Heading>
						{event ? (
							dayjs(String(date)).startOf('day').tz(event.timeZone).format('MMMM D')
						) : (
							<Skeleton className="w-full max-w-xl" />
						)}
					</Heading>
				</FlexRowBetween>

				<SessionList sessions={sessionsByDateData} event={event} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewSessionTypePage;
