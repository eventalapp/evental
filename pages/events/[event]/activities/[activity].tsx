import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../../../../components/Column';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ViewActivityPage: NextPage = () => {
	const router = useRouter();
	const { activity, event } = router.query;

	return (
		<Column className="py-10">
			<Head>
				<title>Viewing Activity: {activity}</title>
			</Head>

			<Link href={`/events/${event}/activities`}>
				<a className="text-blue-900">Back to activities</a>
			</Link>

			<h1 className="text-3xl">View Activity Page id: {activity}</h1>

			<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
		</Column>
	);
};

export default ViewActivityPage;
