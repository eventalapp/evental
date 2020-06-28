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
import { ViewSessionType } from '../../../../../components/sessions/ViewSessionType';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionTypeQuery } from '../../../../../hooks/queries/useSessionTypeQuery';
import { useSessionsByTypeQuery } from '../../../../../hooks/queries/useSessionsByTypeQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const ViewSessionTypePage: NextPage = () => {
	const router = useRouter();
	const { tid, eid } = router.query;
	const { user } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionType } = useSessionTypeQuery(String(eid), String(tid));
	const { sessionsByTypeData } = useSessionsByTypeQuery(String(eid), String(tid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && sessionType && (
				<NextSeo
					title={`${sessionType.name} — ${event.name}`}
					description={`View all of the ${sessionType.name} sessions.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/sessions/types/${sessionType.slug}`,
						title: `${sessionType.name} — ${event.name}`,
						description: `View all of the ${sessionType.name} sessions.`,
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
				<ViewSessionType
					sessionType={sessionType}
					eid={String(eid)}
					tid={String(tid)}
					sessions={sessionsByTypeData}
					event={event}
					user={user}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewSessionTypePage;
