import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useAttendee, useRoles, useUnclaimedUser } from '@eventalapp/shared/hooks';

import { AdminEditAttendeeForm } from '../../../../../../components/attendees/AdminEditAttendeeForm';
import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';

const EditAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid, uid } = router.query;
	const {
		data: attendee,
		error: attendeeError,
		isLoading: isAttendeeLoading
	} = useAttendee({
		eid: String(eid),
		uid: String(uid)
	});
	const {
		data: roles,
		isLoading: isRolesLoading,
		error: rolesError
	} = useRoles({ eid: String(eid) });
	const { isLoading: isUnclaimedUserLoading, data: unclaimedUser } = useUnclaimedUser({
		eid: String(eid),
		uid: String(uid)
	});

	return (
		<AdminPageWrapper
			errors={[attendeeError, rolesError]}
			eid={String(eid)}
			isLoading={isRolesLoading || isAttendeeLoading || isUnclaimedUserLoading}
		>
			<PageWrapper>
				<Head>
					<title>Edit Attendee</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<div className="mb-2">
							<Heading>Edit {attendee?.user.name ?? 'Attendee'}</Heading>
						</div>

						<p className="mt-1 mb-8 text-sm text-gray-600">
							This attendee profile will be visible on the event page. This profile is separate from
							the users profile. You cannot edit the users details such as company, description,
							image, etc. You may want to{' '}
							<Link href={`/events/${eid}/admin/attendees/create`}>
								<a className="text-gray-900 underline">create an attendee</a>
							</Link>{' '}
							if you're looking to change the users details.
						</p>

						{attendee && roles && !isUnclaimedUserLoading && (
							<AdminEditAttendeeForm
								uid={String(uid)}
								eid={String(eid)}
								attendee={attendee}
								roles={roles}
								user={unclaimedUser}
							/>
						)}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditAttendeePage;
