import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';
import { RoleList } from '../../../../../components/roles/RoleList';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';

const RolesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	return (
		<AdminPageWrapper errors={[rolesError]} eid={String(eid)} isLoading={isRolesLoading}>
			<PageWrapper>
				<Head>
					<title>Edit Roles</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<div>
							<FlexRowBetween>
								<Heading>Roles</Heading>

								<IconLinkTooltip
									message="Create a role"
									href={`/events/${eid}/admin/roles/create`}
									icon={faSquarePlus}
									color="gray"
								/>
							</FlexRowBetween>

							<RoleList
								admin
								eid={String(eid)}
								roles={roles}
								isRolesLoading={isRolesLoading}
								rolesError={rolesError}
							/>
						</div>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default RolesAdminPage;
