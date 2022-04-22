import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import { RoleList } from '../../../../components/Roles/RoleList';
import { ServerError } from '../../../../components/ServerError';
import { useOrganizerQuery } from '../../../../hooks/useOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/useRolesQuery';

const RolesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<>
			<Head>
				<title>Roles Page</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Roles Page</h1>

					{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/roles/create`} passHref>
							<LinkButton className="mr-3">Create role</LinkButton>
						</Link>
					)}
				</div>

				{rolesError ? (
					<ServerError error={rolesError} />
				) : (
					<RoleList eid={String(eid)} roles={roles} loading={isRolesLoading} />
				)}
			</Column>
		</>
	);
};

export default RolesPage;
