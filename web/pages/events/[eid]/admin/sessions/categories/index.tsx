import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useSessionCategories } from '@eventalapp/shared/hooks';

import { SessionCategoryList } from '../../../../../../components/categories/SessionCategoryList';
import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../../components/primitives/IconLinkTooltip';

const SessionCategoriesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: sessionCategories,
		error: sessionCategoriesError,
		isLoading: isSessionCategoriesLoading
	} = useSessionCategories({ eid: String(eid) });

	return (
		<AdminPageWrapper
			errors={[sessionCategoriesError]}
			isLoading={isSessionCategoriesLoading}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Session Categories</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Session Categories</Heading>

							<IconLinkTooltip
								message="Create a session category"
								href={`/events/${eid}/admin/sessions/categories/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						</FlexRowBetween>

						<SessionCategoryList eid={String(eid)} sessionCategories={sessionCategories} admin />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default SessionCategoriesAdminPage;
