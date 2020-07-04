import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import { IconLinkTooltip } from '../../../../../../components/IconLinkTooltip';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SessionCategoryList } from '../../../../../../components/sessions/SessionCategoryList';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../../components/typography/Heading';
import { useSessionCategoriesQuery } from '../../../../../../hooks/queries/useSessionCategoriesQuery';

const SessionCategoriesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { sessionCategories, sessionCategoriesError, isSessionCategoriesLoading } =
		useSessionCategoriesQuery(String(eid));

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

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Session Categories</Heading>

							<IconLinkTooltip
								message="Create a session category"
								side="top"
								href={`/events/${eid}/admin/sessions/categories/create`}
								icon={faSquarePlus}
								className="text-gray-700 hover:text-gray-600"
							/>
						</FlexRowBetween>

						<SessionCategoryList eid={String(eid)} sessionCategories={sessionCategories} admin />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default SessionCategoriesAdminPage;
