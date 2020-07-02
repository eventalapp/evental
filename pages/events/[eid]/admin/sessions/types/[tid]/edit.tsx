import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { EditSessionCategoryForm } from '../../../../../../../components/sessions/EditSessionCategoryForm';
import { Heading } from '../../../../../../../components/typography/Heading';
import { useEditSessionCategoryMutation } from '../../../../../../../hooks/mutations/useEditSessionCategoryMutation';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoryQuery } from '../../../../../../../hooks/queries/useSessionCategoryQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../../../hooks/queries/useVenuesQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, cid } = router.query;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { venues, venuesError } = useVenuesQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { user } = useUser();
	const { editSessionCategoryMutation } = useEditSessionCategoryMutation(String(eid), String(cid));
	const { isSessionCategoryLoading, sessionCategory, sessionCategoryError } =
		useSessionCategoryQuery(String(eid), String(cid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!sessionCategory) {
		return <NotFoundPage message="Session not found" />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError || eventError) {
		return <ViewErrorPage errors={[venuesError, eventError]} />;
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
				<Heading>Edit Session Type</Heading>

				<EditSessionCategoryForm
					sessionCategory={sessionCategory}
					isSessionCategoryLoading={isSessionCategoryLoading}
					sessionCategoryError={sessionCategoryError}
					editSessionCategoryMutation={editSessionCategoryMutation}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default EditSessionPage;
