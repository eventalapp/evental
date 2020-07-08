import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminEditAttendeeForm } from '../../../../../../components/attendees/AdminEditAttendeeForm';
import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../components/layout/SidebarWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUnclaimedUserQuery } from '../../../../../../hooks/queries/useUnclaimedUserQuery';

const EditAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid, uid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(uid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { isUnclaimedUserLoading, unclaimedUser } = useUnclaimedUserQuery(String(eid), String(uid));

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

				<SidebarWrapper eid={String(eid)}>
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
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditAttendeePage;
