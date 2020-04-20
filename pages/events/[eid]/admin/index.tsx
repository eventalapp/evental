import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/Column';
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
				<Link href={`/events/${eid}`}>
					<a className="text-blue-900">Back to event page</a>
				</Link>
				<h1 className="text-3xl">Admin Page</h1>

				<Link href={`/events/${eid}/admin/activities/create`}>
					<a className="text-blue-900 p-5">Create activity</a>
				</Link>
			</Column>
		</>
	);
};

export default AdminPage;
