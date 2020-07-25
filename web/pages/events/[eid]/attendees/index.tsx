import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useAttendees, useEvent, useIsOrganizer } from '@eventalapp/shared/hooks';

import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Heading } from '../../../../components/primitives/Heading';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: attendeesData } = useAttendees({ eid: String(eid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && (
		<NextSeo
			title={`Attendees — ${event.name}`}
			description={`View all of the attendees for ${event.name}.`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/attendees`,
				title: `Attendees — ${event.name}`,
				description: `View all of the attendees for ${event.name}.`,
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
					<EventHeader adminLink={'/attendees'} eid={String(eid)} />

					<Heading className="mb-3" variant="xl" level={2}>
						{event && attendeesData ? (
							<>
								Attendees{' '}
								{attendeesData && (
									<span className="font-normal text-gray-500">({attendeesData.length || 0})</span>
								)}
							</>
						) : (
							<Skeleton className="w-48" />
						)}
					</Heading>

					<AttendeeList attendees={attendeesData} eid={String(eid)} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewAttendeePage;
