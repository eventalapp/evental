import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Heading } from '../../../../components/typography/Heading';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { attendeesData } = useAttendeesQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && (
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
			)}

			<EventNavigation eid={String(eid)} />

			<Column>
				<EventHeader adminLink={'/attendees'} eid={String(eid)} />

				<Heading className="mb-3">
					Attendees{' '}
					{attendeesData && (
						<span className="font-normal text-gray-500">({attendeesData.length || 0})</span>
					)}
				</Heading>

				<AttendeeList attendees={attendeesData} eid={String(eid)} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewAttendeePage;
