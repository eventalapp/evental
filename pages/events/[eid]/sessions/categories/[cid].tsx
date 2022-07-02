import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { ViewSessionCategory } from '../../../../../components/sessions/ViewSessionCategory';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoryQuery } from '../../../../../hooks/queries/useSessionCategoryQuery';
import { useSessionsByCategoryQuery } from '../../../../../hooks/queries/useSessionsByCategoryQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const ViewSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { cid, eid } = router.query;
	const { user } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionCategory } = useSessionCategoryQuery(String(eid), String(cid));
	const { sessionsByTypeData } = useSessionsByCategoryQuery(String(eid), String(cid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && sessionCategory && (
				<NextSeo
					title={`${sessionCategory.name} — ${event.name}`}
					description={`View all of the ${sessionCategory.name} sessions.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/sessions/categories/${sessionCategory.slug}`,
						title: `${sessionCategory.name} — ${event.name}`,
						description: `View all of the ${sessionCategory.name} sessions.`,
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
				<ViewSessionCategory
					sessionCategory={sessionCategory}
					eid={String(eid)}
					cid={String(cid)}
					sessions={sessionsByTypeData}
					event={event}
					user={user}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewSessionCategoryPage;
