import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { DeleteSessionTypeForm } from '../../../../../../../components/sessions/DeleteSessionTypeForm';
import { Heading } from '../../../../../../../components/typography/Heading';
import { useDeleteSessionTypeMutation } from '../../../../../../../hooks/mutations/useDeleteSessionTypeMutation';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../../hooks/queries/useRolesQuery';
import { useSessionTypeQuery } from '../../../../../../../hooks/queries/useSessionTypeQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';

const DeleteSessionTypePage: NextPage = () => {
	const router = useRouter();
	const { eid, tid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { sessionType, isSessionTypeLoading, sessionTypeError } = useSessionTypeQuery(
		String(eid),
		String(tid)
	);
	const { deleteSessionTypeMutation } = useDeleteSessionTypeMutation(String(eid), String(tid));
	const { user, isUserLoading } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (sessionTypeError) {
		return <NotFoundPage message="Session type not found" />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete SessionType</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				{sessionType && (
					<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						You are about to delete a session type ("{sessionType.name}")
					</p>
				)}

				<Heading>Delete Session Type</Heading>

				<DeleteSessionTypeForm
					sessionType={sessionType}
					isSessionTypeLoading={isSessionTypeLoading}
					sessionTypeError={sessionTypeError}
					deleteSessionTypeMutation={deleteSessionTypeMutation}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default DeleteSessionTypePage;
