import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/Column';
import { Navigation } from '../../../components/Navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { ViewEvent } from '../../../components/Events/ViewEvent';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event } = useEventQuery(String(eid));

	return (
		<div>
			<Head>
				<title>{event && event.location}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<ViewEvent eid={String(eid)} />
			</Column>
		</div>
	);
};

export default ViewEventPage;
