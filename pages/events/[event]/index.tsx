import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../../../components/Column';
import { useRouter } from 'next/router';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { event } = router.query;

	return (
		<Column className="py-10">
			<Head>
				<title>Viewing Event: {event}</title>
			</Head>

			<h1 className="text-3xl">View Event Page id: {event}</h1>

			<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
		</Column>
	);
};

export default ViewEventPage;
