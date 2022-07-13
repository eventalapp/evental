import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { EditSessionForm } from '../../../../../../components/sessions/EditSessionForm';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useSessionCategoriesQuery } from '../../../../../../hooks/queries/useSessionCategoriesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useSessionRoleAttendeesQuery } from '../../../../../../hooks/queries/useSessionRoleAttendeesQuery';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { sessionCategories, isSessionCategoriesLoading, sessionCategoriesError } =
		useSessionCategoriesQuery(String(eid));
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid));

	return (
		<AdminPageWrapper
			eid={String(eid)}
			isLoading={
				isSessionLoading || isVenuesLoading || isEventLoading || isSessionCategoriesLoading
			}
			errors={[sessionError, venuesError, eventError, sessionCategoriesError]}
		>
			<PageWrapper>
				<Head>
					<title>Edit Session</title>
				</Head>
				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Session</Heading>

						{venues && session && event && sessionCategories && (
							<EditSessionForm
								roleAttendees={sessionRoleAttendeesQuery.data ?? []}
								eid={String(eid)}
								sid={String(sid)}
								venues={venues}
								session={session}
								sessionCategories={sessionCategories}
								event={event}
							/>
						)}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditSessionPage;
