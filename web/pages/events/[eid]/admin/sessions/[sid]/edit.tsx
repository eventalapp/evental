import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import {
	useEvent,
	useSession,
	useSessionCategories,
	useSessionRoleAttendees,
	useVenues
} from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { EditSessionForm } from '../../../../../../components/sessions/EditSessionForm';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const {
		data: venues,
		error: venuesError,
		isLoading: isVenuesLoading
	} = useVenues({ eid: String(eid) });
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });
	const {
		data: session,
		error: sessionError,
		isLoading: isSessionLoading
	} = useSession({ eid: String(eid), sid: String(sid) });
	const {
		data: sessionCategories,
		isLoading: isSessionCategoriesLoading,
		error: sessionCategoriesError
	} = useSessionCategories({ eid: String(eid) });
	const { data: sessionRoleAttendees, isLoading: isSessionRoleAttendeesLoading } =
		useSessionRoleAttendees({
			eid: String(eid),
			sid: String(sid)
		});

	return (
		<AdminPageWrapper
			eid={String(eid)}
			isLoading={
				isSessionLoading ||
				isVenuesLoading ||
				isEventLoading ||
				isSessionCategoriesLoading ||
				isSessionRoleAttendeesLoading
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
								roleAttendees={sessionRoleAttendees ?? []}
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
