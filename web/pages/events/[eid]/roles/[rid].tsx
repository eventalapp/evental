import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { useAttendeesByRole, useEvent, useIsOrganizer, useRole } from '@eventalapp/shared/hooks';

import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewRole } from '../../../../components/roles/ViewRole';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { data: role, error: roleError } = useRole({ eid: String(eid), rid: String(rid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: attendees } = useAttendeesByRole({ eid: String(eid), rid: String(rid) });

	if (roleError) {
		return <NotFoundPage message="Role not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = role && event && (
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
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<EventHeader adminLink={`/roles/${rid}`} eid={String(eid)} />

					<ViewRole attendees={attendees} eid={String(eid)} rid={String(rid)} role={role} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewAttendeePage;
