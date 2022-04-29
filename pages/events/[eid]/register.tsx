import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { getSession } from 'next-auth/react';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Session } from 'next-auth';
import { EventRegistrationForm } from '../../../components/events/EventRegistrationForm';
import { useRegisterAttendeeMutation } from '../../../hooks/mutations/useRegisterAttendeeMutation';

type Props = {
	session: Session | null;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { registerAttendeeError, registerAttendeeMutation } = useRegisterAttendeeMutation(
		String(eid)
	);

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event signup</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Register for this event</h1>

				<EventRegistrationForm
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					registerAttendeeMutation={registerAttendeeMutation}
					registerAttendeeError={registerAttendeeError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const session = await getSession(context);

	return {
		props: {
			session
		}
	};
};

export default EventRegisterPage;
