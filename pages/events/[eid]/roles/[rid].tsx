import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewRole } from '../../../../components/roles/ViewRole';
import { useAttendeesByRoleQuery } from '../../../../hooks/queries/useAttendeesByRoleQuery';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useRoleQuery } from '../../../../hooks/queries/useRoleAttendeesQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { role, roleError } = useRoleQuery(String(eid), String(rid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { attendeesData } = useAttendeesByRoleQuery(String(eid), String(rid));

	if (roleError) {
		return <NotFoundPage message="Role not found." />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{role && event && (
				<NextSeo
					title={`${role.name} — ${event.name}`}
					description={`View all of the members of the ${role.name} role.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/roles/${role.slug}`,
						title: `${role.name} — ${event.name}`,
						description: `View all of the members of the ${role.name} role.`,
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
				<EventHeader adminLink={`/roles/${rid}`} eid={String(eid)} />

				<ViewRole attendees={attendeesData} eid={String(eid)} rid={String(rid)} role={role} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewAttendeePage;
