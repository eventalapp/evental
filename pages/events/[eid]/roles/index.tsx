import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { RoleList } from '../../../../components/roles/RoleList';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../../../../components/form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';

const RolesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<div>
			<Head>
				<title>Roles Page</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton href={`/events/${eid}`}>Event</BackButton>

				<FlexRowBetween>
					<h1 className="text-3xl">Roles Page</h1>

					{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/roles/create`} passHref>
							<LinkButton>Create role</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<RoleList
					eid={String(eid)}
					roles={roles}
					isOrganizerError={isOrganizerError}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>
			</Column>
		</div>
	);
};

export default RolesPage;
