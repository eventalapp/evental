import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { LinkButton } from '../../../../../components/Form/LinkButton';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import { RoleList } from '../../../../../components/Roles/RoleList';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/useOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/useRolesQuery';

const RolesPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>All Venues</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Roles Admin Page</h1>
					<Link href={`/events/${eid}/admin/roles/create`} passHref>
						<LinkButton className="mr-3">Create role</LinkButton>
					</Link>
				</div>

				<RoleList roles={roles} eid={String(eid)} loading={isRolesLoading} />
			</Column>
		</>
	);
};

export default RolesPage;
