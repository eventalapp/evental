import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { useAttendee, useEvent, useIsOrganizer } from '@eventalapp/shared/hooks';

import { ViewAttendee } from '../../../../components/attendees/ViewAttendee';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { uid, eid } = router.query;
	const { data: attendee, error: attendeeError } = useAttendee({
		eid: String(eid),
		uid: String(uid)
	});
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	if (attendeeError) {
		return <NotFoundPage message="Attendee not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = attendee && event && (
		<NextSeo
			title={`${attendee.user.name} — ${event.name}`}
			description={`View ${attendee.user.name} at ${event.name}.`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/attendees/${attendee.user.id}`,
				title: `${attendee.user.name} — ${event.name}`,
				description: `View ${attendee.user.name} at ${event.name}.`,
				images: [
					{
						url: `https://cdn.evental.app${attendee.user.image}`,
						width: 300,
						height: 300,
						alt: `${attendee.user.name} Avatar Alt`,
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
					<ViewAttendee attendee={attendee} eid={String(eid)} uid={String(uid)} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewAttendeePage;
