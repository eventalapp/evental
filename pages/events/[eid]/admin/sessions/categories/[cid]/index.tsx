import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { ViewSessionCategory } from '../../../../../../../components/sessions/ViewSessionCategory';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoryQuery } from '../../../../../../../hooks/queries/useSessionCategoryQuery';
import { useSessionsByCategoryQuery } from '../../../../../../../hooks/queries/useSessionsByCategoryQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';

const ViewSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { cid, eid } = router.query;
	const { user } = useUser();
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionCategory, sessionCategoryError } = useSessionCategoryQuery(
		String(eid),
		String(cid)
	);
	const { sessionsByTypeData } = useSessionsByCategoryQuery(String(eid), String(cid));

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionCategory) {
		return <NotFoundPage message="Session category not found." />;
	}

	if (!sessionsByTypeData) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (sessionCategoryError || eventError) {
		return <ViewErrorPage errors={[sessionCategoryError, eventError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Viewing Session</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<ViewSessionCategory
					sessionCategory={sessionCategory}
					eid={String(eid)}
					cid={String(cid)}
					sessions={sessionsByTypeData}
					event={event}
					user={user}
					admin
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewSessionCategoryPage;
