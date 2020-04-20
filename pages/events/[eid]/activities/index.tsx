import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

	return (
		<>
			<Head>
				<title>All Activities</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<Link href={`/events/${eid}`}>
					<a className="text-blue-900">Back to event</a>
				</Link>
				<h1 className="text-3xl">Activities Page</h1>
				<Link href={`/events/${eid}/activities/1`}>
					<a className="text-blue-900 p-3">Activities #1</a>
				</Link>
				<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
			</Column>
		</>
	);
};

export default ActivitiesPage;
