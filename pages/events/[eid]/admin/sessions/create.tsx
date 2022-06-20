import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../components/Footer';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { CreateSessionForm } from '../../../../../components/sessions/CreateSessionForm';
import { useCreateSessionMutation } from '../../../../../hooks/mutations/useCreateSessionMutation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionTypesQuery } from '../../../../../hooks/queries/useSessionTypesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { createSessionMutation } = useCreateSessionMutation(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { sessionTypes, isSessionTypesLoading, sessionTypesError } = useSessionTypesQuery(
		String(eid)
	);

	if (isVenuesLoading || isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
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
				<title>Create Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl font-medium md:text-2xl">Create Session</h3>

				<CreateSessionForm
					sessionTypes={sessionTypes}
					isSessionTypesLoading={isSessionTypesLoading}
					sessionTypesError={sessionTypesError}
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createSessionMutation={createSessionMutation}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default CreateSessionPage;
