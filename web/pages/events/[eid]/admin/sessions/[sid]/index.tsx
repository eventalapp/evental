import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import {
	useEvent,
	useIsSessionAttendee,
	useSession,
	useSessionAttendees,
	useSessionRoleAttendees,
	useUser
} from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewSession } from '../../../../../../components/sessions/ViewSession';

const ViewSessionPage: NextPage = () => {
	const router = useRouter();
	const { sid, eid } = router.query;
	const { data: user, isLoading: isUserLoading } = useUser();
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
	const { data: sessionAttendees, isLoading: isSessionAttendeesLoading } = useSessionAttendees({
		eid: String(eid),
		sid: String(sid)
	});
	const { data: isSessionAttendee, isLoading: isSessionAttendeeLoading } = useIsSessionAttendee({
		eid: String(eid),
		sid: String(sid)
	});
	const { data: sessionRoleAttendees, isLoading: isSessionRoleAttendeesLoading } =
		useSessionRoleAttendees({
			eid: String(eid),
			sid: String(sid)
		});

	const isLoading =
		isSessionLoading ||
		isEventLoading ||
		isSessionRoleAttendeesLoading ||
		isSessionAttendeesLoading ||
		isSessionAttendeeLoading ||
		isUserLoading;

	return (
		<AdminPageWrapper errors={[eventError, sessionError]} isLoading={isLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Viewing Session</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewSession
							admin
							user={user}
							roleAttendees={sessionRoleAttendees}
							attendees={sessionAttendees}
							isAttending={isSessionAttendee}
							session={session}
							eid={String(eid)}
							sid={String(sid)}
							event={event}
							isLoading={isLoading}
						/>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewSessionPage;
