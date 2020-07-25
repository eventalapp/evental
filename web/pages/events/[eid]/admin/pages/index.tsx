import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { usePages } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { PageList } from '../../../../../components/pages/PageList';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';

const PagesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: pages,
		error: pagesError,
		isLoading: isPagesLoading
	} = usePages({ eid: String(eid) });

	return (
		<AdminPageWrapper errors={[pagesError]} isLoading={isPagesLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Edit Pages</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
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
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default PagesAdminPage;
