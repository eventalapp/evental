import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/Column';

const AttendeesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

	return (
		<Column className="py-10">
			<Head>
				<title>All Attendees</title>
			</Head>

			<Link href={`/events/${eid}`}>
				<a className="text-blue-900">Back to event</a>
			</Link>

			<h1 className="text-3xl">Attendees Page</h1>

			<Link href={`/events/${eid}/attendees/1`}>
				<a className="text-blue-900 p-3">Attendee #1</a>
			</Link>
		</Column>
	);
};

export default AttendeesPage;
