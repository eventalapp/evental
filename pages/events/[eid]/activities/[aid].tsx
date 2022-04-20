import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

const ViewActivityPage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;

	return (
		<>
			<Head>
				<title>Viewing Activity: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<Link href={`/events/${eid}/activities`}>
					<a className="text-blue-900">Back to activities</a>
				</Link>

				<h1 className="text-3xl">View Activity Page id: {aid}</h1>

				<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
			</Column>
		</>
	);
};

export default ViewActivityPage;
