import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Button } from '../../../../components/primitives/Button';
import { Heading } from '../../../../components/primitives/Heading';
import { SessionList } from '../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';

const SessionsPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { sessionsData } = useSessionsQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const [showPastSessions, setShowPastSessions] = useState(false);

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
					title={`Sessions — ${event.name}`}
					description={`View all of the sessions for ${event.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/sessions`,
						title: `Sessions — ${event.name}`,
						description: `View all of the sessions for ${event.name}.`,
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
				<EventHeader adminLink={'/sessions'} eid={String(eid)} />

				<Heading className="flex flex-row items-center mb-3" variant="xl" level={2}>
					Sessions
					<Button
						className="ml-3"
						onClick={() => {
							setShowPastSessions(!showPastSessions);
						}}
					>
						{showPastSessions ? 'Hide' : 'Show'} Past Sessions
					</Button>
				</Heading>

				<SessionList sessions={sessionsData} event={event} showPastSessions={showPastSessions} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default SessionsPage;
