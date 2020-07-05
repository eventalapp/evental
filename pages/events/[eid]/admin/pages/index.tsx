import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/layout/SidebarWrapper';
import { PageList } from '../../../../../components/pages/PageList';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';

const PagesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { pages, pagesError, isPagesLoading } = usePagesQuery(String(eid));

	return (
		<AdminPageWrapper errors={[pagesError]} isLoading={isPagesLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Edit Pages</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Pages</Heading>

							<IconLinkTooltip
								message="Create a page"
								href={`/events/${eid}/admin/pages/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						</FlexRowBetween>

						<PageList admin eid={String(eid)} pages={pages} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default PagesAdminPage;
