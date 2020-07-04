import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import { AdminCreateAttendeeForm } from '../../../../../components/attendees/AdminCreateAttendeeForm';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { Paragraph } from '../../../../../components/typography/Paragraph';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';

const CreateAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	return (
		<AdminPageWrapper errors={[rolesError]} isLoading={isRolesLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Create Attendee</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Create Attendee Page</Heading>

						<Paragraph className="text-gray-600">
							Filling out the information below will create an placeholder account for this user.
							They will receive an email with instructions on how to claim their account.
						</Paragraph>

						{roles && <AdminCreateAttendeeForm eid={String(eid)} roles={roles} />}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateAttendeePage;
