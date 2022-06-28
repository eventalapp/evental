import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeleteSessionForm } from '../../../../../../components/sessions/DeleteSessionForm';
import { Heading } from '../../../../../../components/typography/Heading';
import { useDeleteSessionMutation } from '../../../../../../hooks/mutations/useDeleteSessionMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeleteSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { deleteSessionMutation } = useDeleteSessionMutation(String(eid), String(sid));
	const { user, isUserLoading } = useUser();
	const { event, eventError } = useEventQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (sessionError) {
		return <NotFoundPage message="Session not found" />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete Session</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				{session && (
					<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						You are about to delete an session ("{session.name}")
					</p>
				)}

				<Heading>Delete Session</Heading>

				<DeleteSessionForm
					session={session}
					isSessionLoading={isSessionLoading}
					sessionError={sessionError}
					deleteSessionMutation={deleteSessionMutation}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default DeleteSessionPage;
