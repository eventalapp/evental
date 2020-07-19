import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent } from '@eventalapp/shared/hooks/queries/useEvent';
import { useIsOrganizer } from '@eventalapp/shared/hooks/queries/useIsOrganizer';
import { useIsSessionAttendee } from '@eventalapp/shared/hooks/queries/useIsSessionAttendee';
import { useSession } from '@eventalapp/shared/hooks/queries/useSession';
import { useSessionAttendees } from '@eventalapp/shared/hooks/queries/useSessionAttendees';
import { useSessionRoleAttendees } from '@eventalapp/shared/hooks/queries/useSessionRoleAttendees';
import { useUser } from '@eventalapp/shared/hooks/queries/useUser';

import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import { Footer } from '../../../../../components/layout/Footer';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { ViewSession } from '../../../../../components/sessions/ViewSession';

const ViewSessionPage: NextPage = () => {
	const router = useRouter();
	const { sid, eid } = router.query;
	const { data: user } = useUser();
	const { data: session, error: sessionError } = useSession({ eid: String(eid), sid: String(sid) });
	const { data: sessionAttendees } = useSessionAttendees({ eid: String(eid), sid: String(sid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: isSessionAttendee } = useIsSessionAttendee({ eid: String(eid), sid: String(sid) });
	const { data: sessionRoleAttendees } = useSessionRoleAttendees({
		eid: String(eid),
		sid: String(sid)
	});

	if (sessionError) {
		return <NotFoundPage message="Session not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = session && event && (
		<NextSeo
			title={`${session.name} — ${event.name}`}
			description={`View the attendees, speakers, and details of ${session.name} at ${event.name}`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/sessions/${session.slug}`,
				title: `${session.name} — ${event.name}`,
				description: `View the attendees, speakers, and details of ${session.name} at ${event.name}`,
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
					<ViewSession
						user={user}
						roleAttendees={sessionRoleAttendees}
						attendees={sessionAttendees}
						isAttending={Boolean(isSessionAttendee)}
						session={session}
						eid={String(eid)}
						sid={String(sid)}
						event={event}
					/>
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewSessionPage;
