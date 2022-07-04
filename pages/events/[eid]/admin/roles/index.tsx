import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { RoleList } from '../../../../../components/roles/RoleList';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
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

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<div>
							<FlexRowBetween>
								<Heading>Roles</Heading>

								<IconLinkTooltip
									message="Create a role"
									side="top"
									href={`/events/${eid}/admin/roles/create`}
									icon={faSquarePlus}
									className="text-gray-700 hover:text-gray-600"
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
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default RolesAdminPage;
