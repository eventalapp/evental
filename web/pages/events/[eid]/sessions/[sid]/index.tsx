import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import {
	useEvent,
	useIsOrganizer,
	useIsSessionAttendee,
	useSession,
	useSessionAttendees,
	useSessionRoleAttendees,
	useUser
} from '@eventalapp/shared/hooks';

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
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: user, isLoading: isUserLoading } = useUser();
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });
	const {
		data: session,
		error: sessionError,
		isLoading: isSessionLoading
	} = useSession({ eid: String(eid), sid: String(sid) });
	const { data: sessionAttendees, isLoading: isSessionAttendeesLoading } = useSessionAttendees({
		eid: String(eid),
		sid: String(sid)
	});
	const { data: isSessionAttendee, isLoading: isSessionAttendeeLoading } = useIsSessionAttendee({
		eid: String(eid),
		sid: String(sid)
	});
	const { data: sessionRoleAttendees, isLoading: isSessionRoleAttendeesLoading } =
		useSessionRoleAttendees({
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

	const isLoading =
		isSessionLoading ||
		isEventLoading ||
		isSessionRoleAttendeesLoading ||
		isSessionAttendeesLoading ||
		isSessionAttendeeLoading ||
		isUserLoading ||
		isOrganizerLoading;

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
						isLoading={isLoading}
					/>
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewSessionPage;
