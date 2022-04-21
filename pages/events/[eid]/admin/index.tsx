import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import Unauthorized from '../../../../components/Unauthorized';

const AdminPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	return (
		<>
			<Head>
				<title>Admin panel {eid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Admin Page</h1>

				<Link href={`/events/${eid}/admin/activities/create`} passHref>
					<LinkButton className="mr-3">Create activity</LinkButton>
				</Link>
				<Link href={`/events/${eid}/admin/edit`} passHref>
					<LinkButton>Edit event</LinkButton>
				</Link>
			</Column>
		</>
	);
};

export default AdminPage;
