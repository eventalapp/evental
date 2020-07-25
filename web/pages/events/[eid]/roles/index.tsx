import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useEvent, useIsOrganizer, useRoles } from '@eventalapp/shared/hooks';

import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Heading } from '../../../../components/primitives/Heading';
import { RoleList } from '../../../../components/roles/RoleList';

const RolesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: roles } = useRoles({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && (
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
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<EventHeader adminLink={'/roles'} eid={String(eid)} />

					<Heading variant="xl" level={2}>
						{event && roles ? 'Roles' : <Skeleton className="w-48" />}
					</Heading>

					<RoleList eid={String(eid)} roles={roles ?? []} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default RolesPage;
