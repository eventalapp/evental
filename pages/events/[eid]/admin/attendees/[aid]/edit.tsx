import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { AdminEditAttendeeForm } from '../../../../../../components/attendees/AdminEditAttendeeForm';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useAdminEditAttendeeMutation } from '../../../../../../hooks/mutations/useAdminEditAttendeeMutation';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { EventAttendeeUser, getAttendee } from '../../../../../api/events/[eid]/attendees/[aid]';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import Prisma from '@prisma/client';
import { getRoles } from '../../../../../api/events/[eid]/roles';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { useImageUploadMutation } from '../../../../../../hooks/mutations/useImageUploadMutation';
import { PasswordlessUser, ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';

type Props = {
	initialOrganizer: boolean;
	initialAttendee: EventAttendeeUser | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialUser: PasswordlessUser | undefined;
};

const EditAttendeePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialAttendee, initialRoles, initialUser } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(
		String(eid),
		String(aid),
		initialAttendee
	);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { adminEditAttendeeMutation } = useAdminEditAttendeeMutation(String(eid), String(aid));
	const { imageUploadMutation, imageUploadResponse } = useImageUploadMutation();
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialAttendee || !attendee) {
		return <NotFoundPage message="Attendee not found." />;
	}

	if (!initialRoles || !roles) {
		return <NotFoundPage message="No roles not found." />;
	}

	if (isAttendeeLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (attendeeError || rolesError) {
		return <ViewErrorPage errors={[attendeeError, rolesError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Attendee</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Edit Attendee</h1>

				<p className="text-gray-700 mt-1">
					This attendee profile will be visible on the event page. This profile is separate from
					your user profile.
				</p>

				<AdminEditAttendeeForm
					imageUploadMutation={imageUploadMutation}
					imageUploadResponse={imageUploadResponse}
					eid={String(eid)}
					attendee={attendee}
					isAttendeeLoading={isAttendeeLoading}
					attendeeError={attendeeError}
					adminEditAttendeeMutation={adminEditAttendeeMutation}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, aid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialAttendee = (await getAttendee(String(eid), String(aid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialAttendee,
			initialRoles
		}
	};
};

export default EditAttendeePage;
