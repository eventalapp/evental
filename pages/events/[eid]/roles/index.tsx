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
import { RoleList } from '../../../../components/roles/RoleList';
import { Heading } from '../../../../components/typography/Heading';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';

const RolesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));

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
					title={`Roles — ${event.name}`}
					description={`View all of the roles at ${event.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/roles`,
						title: `Roles — ${event.name}`,
						description: `View all of the roles at ${event.name}.`,
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
				<EventHeader adminLink={'/roles'} eid={String(eid)} />

				<Heading>Roles</Heading>

				<RoleList
					eid={String(eid)}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>

				<Footer color={event?.color} />
			</Column>
		</PageWrapper>
	);
};

export default RolesPage;
