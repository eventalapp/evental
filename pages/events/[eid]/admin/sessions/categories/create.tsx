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
import { CreateSessionCategoryForm } from '../../../../../../components/sessions/CreateSessionCategoryForm';
import { Heading } from '../../../../../../components/typography/Heading';
import { useCreateSessionCategoryMutation } from '../../../../../../hooks/mutations/useCreateSessionCategoryMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { user } = useUser();
	const { createSessionCategoryMutation } = useCreateSessionCategoryMutation(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Create Session Category</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<Heading>Create Session Category</Heading>

				<CreateSessionCategoryForm createSessionCategoryMutation={createSessionCategoryMutation} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default CreateSessionPage;
