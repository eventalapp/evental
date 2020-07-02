import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { InviteRoleForm } from '../../../../../../components/roles/InviteRoleForm';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../../components/typography/Heading';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';

const InviteRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { role, isRoleLoading, roleError } = useRoleQuery(String(eid), String(rid));

	return (
		<AdminPageWrapper eid={String(eid)} isLoading={isRoleLoading} errors={[roleError]}>
			<PageWrapper>
				<Head>
					<title>Invite Role</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						{role && (
							<>
								<FlexRowBetween>
									<Heading>Invite {role.name}</Heading>
								</FlexRowBetween>
								<p className="mb-2 text-base text-gray-700">
									Enter the users email that you wish to invite to the{' '}
									<span className="font-medium">"{role.name}"</span> role. They will receive an
									email with information on how to claim their role.
								</p>
								<InviteRoleForm eid={String(eid)} rid={String(rid)} />
							</>
						)}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default InviteRolePage;
