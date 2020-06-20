import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';
import { Footer } from '../../../../components/Footer';
import { LinkButton } from '../../../../components/form/LinkButton';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation } = useEditEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Event Settings</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl font-medium md:text-2xl">Settings</h3>

				<EditEventForm
					eid={String(eid)}
					eventError={eventError}
					editEventMutation={editEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>

				<p className="mt-5 mb-3 text-lg font-bold text-red-500">Danger Zone</p>
				<div className="rounded-md bg-red-100 p-4">
					<Link href={`/events/${eid}/admin/delete`} passHref>
						<LinkButton variant="danger">Delete Event</LinkButton>
					</Link>
				</div>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default EditEventPage;
