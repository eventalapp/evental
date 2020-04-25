import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { RoleList } from '../../../../components/Roles/RoleList';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../../../../components/Form/LinkButton';
import React from 'react';

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

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-3xl">Roles Page</h1>

					{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/roles/create`} passHref>
							<LinkButton className="mr-3">Create role</LinkButton>
						</Link>
					)}
				</div>

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
