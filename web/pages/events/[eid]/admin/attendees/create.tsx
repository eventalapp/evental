import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminCreateAttendeeForm } from '../../../../../components/attendees/AdminCreateAttendeeForm';
import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../components/primitives/Paragraph';
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

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Create Attendee</Heading>

						<Paragraph className="text-gray-600">
							Filling out the information below will create an placeholder account for this user. If
							you enter their email, they will receive an email with instructions on how to claim
							their account.
						</Paragraph>

						{roles && <AdminCreateAttendeeForm eid={String(eid)} roles={roles} />}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateAttendeePage;
