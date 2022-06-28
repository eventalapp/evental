import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { PageList } from '../../../../components/pages/PageList';
import { Heading } from '../../../../components/typography/Heading';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { useUser } from '../../../../hooks/queries/useUser';

const SessionsPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { pages, pagesError } = usePagesQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { user } = useUser();
	const { isAttendee } = useIsAttendeeQuery(String(eid));

	if (pagesError) {
		return <ViewErrorPage errors={[pagesError]} />;
	}

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
					title={`Pages — ${event.name}`}
					description={`View all of the pages for ${event.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/pages`,
						title: `Pages — ${event.name}`,
						description: `View all of the pages for ${event.name}.`,
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
				<EventHeader
					adminLink={'/pages'}
					event={event}
					isOrganizer={isOrganizer}
					isAttendee={isAttendee}
					user={user}
				/>

				<Heading>Pages</Heading>

				<PageList eid={String(eid)} pages={pages} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default SessionsPage;
