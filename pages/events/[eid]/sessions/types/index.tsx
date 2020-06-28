import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { EventNavigation } from '../../../../../components/events/navigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionTypeList } from '../../../../../components/sessions/SessionTypeList';
import { Heading } from '../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionTypesQuery } from '../../../../../hooks/queries/useSessionTypesQuery';

const SessionTypesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionTypes } = useSessionTypesQuery(String(eid));
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
					title={`Sessions Types — ${event.name}`}
					description={`View all of the sessions types for ${event.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/sessions/types`,
						title: `Session Types — ${event.name}`,
						description: `View all of the sessions types for ${event.name}.`,
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
				<div>
					<Heading>Session Types</Heading>

					<SessionTypeList eid={String(eid)} sessionTypes={sessionTypes} />
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default SessionTypesPage;
