import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import {
	useEvent,
	useIsOrganizer,
	useSessionCategory,
	useSessionsByCategory,
	useUser
} from '@eventalapp/shared/hooks';

import { ViewSessionCategory } from '../../../../../components/categories/ViewSessionCategory';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import { Footer } from '../../../../../components/layout/Footer';
import PageWrapper from '../../../../../components/layout/PageWrapper';

const ViewSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { cid, eid } = router.query;
	const { data: user } = useUser();
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: sessionCategory } = useSessionCategory({ eid: String(eid), cid: String(cid) });
	const { data: sessionsByCategory } = useSessionsByCategory({
		eid: String(eid),
		cid: String(cid)
	});
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && sessionCategory && (
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
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<ViewSessionCategory
						sessionCategory={sessionCategory}
						eid={String(eid)}
						cid={String(cid)}
						sessions={sessionsByCategory}
						event={event}
						user={user}
					/>
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewSessionCategoryPage;
