import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { attendee, eid } = router.query;

	return (
		<>
			<Head>
				<title>Viewing Attendee: {attendee}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<Link href={`/events/${eid}/attendees`}>
					<a className="text-blue-900">Back to attendees</a>
				</Link>
				<h1 className="text-3xl">View Attendee Page id: {attendee}</h1>
				<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
			</Column>
		</>
	);
};

export default ViewAttendeePage;
