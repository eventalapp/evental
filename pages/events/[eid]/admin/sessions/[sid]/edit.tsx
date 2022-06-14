import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../../components/Footer';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditSessionForm } from '../../../../../../components/sessions/EditSessionForm';
import { useEditSessionMutation } from '../../../../../../hooks/mutations/useEditSessionMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useSessionRoleAttendeesQuery } from '../../../../../../hooks/queries/useSessionRoleAttendeesQuery';
import { useSessionTypesQuery } from '../../../../../../hooks/queries/useSessionTypesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { editSessionMutation } = useEditSessionMutation(String(eid), String(sid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { sessionTypes, isSessionTypesLoading, sessionTypesError } = useSessionTypesQuery(
		String(eid)
	);
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid));

	if (
		isRolesLoading ||
		isVenuesLoading ||
		isEventLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isSessionTypesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!session) {
		return <NotFoundPage message="Session not found" />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError || eventError || sessionTypesError) {
		return <ViewErrorPage errors={[venuesError, eventError, sessionTypesError]} />;
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
				<h3 className="text-xl md:text-2xl font-medium">Edit Session</h3>

				<EditSessionForm
					sessionRoleAttendeesQuery={sessionRoleAttendeesQuery}
					eid={String(eid)}
					sid={String(sid)}
					venues={venues}
					session={session}
					sessionTypes={sessionTypes}
					isSessionTypesLoading={isSessionTypesLoading}
					sessionTypesError={sessionTypesError}
					editSessionMutation={editSessionMutation}
					isSessionLoading={isSessionLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
					sessionError={sessionError}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default EditSessionPage;
