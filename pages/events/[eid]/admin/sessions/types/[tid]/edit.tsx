import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { EditSessionTypeForm } from '../../../../../../../components/sessions/EditSessionTypeForm';
import { useEditSessionTypeMutation } from '../../../../../../../hooks/mutations/useEditSessionTypeMutation';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../../hooks/queries/useRolesQuery';
import { useSessionTypeQuery } from '../../../../../../../hooks/queries/useSessionTypeQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../../../hooks/queries/useVenuesQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, tid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { editSessionTypeMutation } = useEditSessionTypeMutation(String(eid), String(tid));
	const { isSessionTypeLoading, sessionType, sessionTypeError } = useSessionTypeQuery(
		String(eid),
		String(tid)
	);

	if (isRolesLoading || isVenuesLoading || isEventLoading || isUserLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!sessionType) {
		return <NotFoundPage message="Session not found" />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError || eventError) {
		return <ViewErrorPage errors={[venuesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Edit Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl font-medium md:text-2xl">Edit Session Type</h3>

				<EditSessionTypeForm
					sessionType={sessionType}
					isSessionTypeLoading={isSessionTypeLoading}
					sessionTypeError={sessionTypeError}
					editSessionTypeMutation={editSessionTypeMutation}
				/>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default EditSessionPage;
