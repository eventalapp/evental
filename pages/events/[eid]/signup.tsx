import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useSession } from 'next-auth/react';
import PageWrapper from '../../../components/layout/PageWrapper';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event signup</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Signup for this event WIP</h1>
			</Column>
		</PageWrapper>
	);
};

export default ViewEventPage;
