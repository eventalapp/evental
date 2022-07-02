import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditSessionForm } from '../../../../../../components/sessions/EditSessionForm';
import { Heading } from '../../../../../../components/typography/Heading';
import { useEditSessionMutation } from '../../../../../../hooks/mutations/useEditSessionMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoriesQuery } from '../../../../../../hooks/queries/useSessionCategoriesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useSessionRoleAttendeesQuery } from '../../../../../../hooks/queries/useSessionRoleAttendeesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { editSessionMutation } = useEditSessionMutation(String(eid), String(sid));
	const { user } = useUser();
	const { sessionCategories, isSessionCategoriesLoading, sessionCategoriesError } =
		useSessionCategoriesQuery(String(eid));
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid));

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

	if (venuesError || eventError || sessionCategoriesError) {
		return <ViewErrorPage errors={[venuesError, eventError, sessionCategoriesError]} />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Edit Session</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<Heading>Edit Session</Heading>

				<EditSessionForm
					sessionRoleAttendeesQuery={sessionRoleAttendeesQuery}
					eid={String(eid)}
					sid={String(sid)}
					venues={venues}
					session={session}
					sessionCategories={sessionCategories}
					isSessionCategoriesLoading={isSessionCategoriesLoading}
					sessionCategoriesError={sessionCategoriesError}
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

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default EditSessionPage;
