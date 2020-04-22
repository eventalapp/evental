import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import NoAccess from '../../../../components/NoAccess';
import Unauthorized from '../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../hooks/useOrganizerQuery';

const AdminPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
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
				<title>Admin panel {eid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Admin Page</h1>

					<div>
						<Link href={`/events/${eid}/admin/activities/`} passHref>
							<LinkButton className="mr-3">Manage activities</LinkButton>
						</Link>
						<Link href={`/events/${eid}/admin/venues/`} passHref>
							<LinkButton className="mr-3">Manage venues</LinkButton>
						</Link>
						<Link href={`/events/${eid}/admin/roles/`} passHref>
							<LinkButton className="mr-3">Manage roles</LinkButton>
						</Link>
						<Link href={`/events/${eid}/admin/attendees/`} passHref>
							<LinkButton className="mr-3">Manage attendees</LinkButton>
						</Link>
						<Link href={`/events/${eid}/admin/edit`} passHref>
							<LinkButton>Edit event</LinkButton>
						</Link>
					</div>
				</div>
				<span>Manage your event</span>
			</Column>
		</>
	);
};

export default AdminPage;
