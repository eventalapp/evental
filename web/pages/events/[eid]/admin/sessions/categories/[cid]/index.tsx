import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import {
	useEvent,
	useSessionCategory,
	useSessionsByCategory,
	useUser
} from '@eventalapp/shared/hooks';

import { ViewSessionCategory } from '../../../../../../../components/categories/ViewSessionCategory';
import { AdminPageWrapper } from '../../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';

const ViewSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { cid, eid } = router.query;
	const { data: user, isLoading: isUserLoading } = useUser();
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });
	const {
		data: sessionCategory,
		error: sessionCategoryError,
		isLoading: isSessionCategoryLoading
	} = useSessionCategory({ eid: String(eid), cid: String(cid) });
	const { data: sessionsByCategory, isLoading: isSessionsByCategoryLoading } =
		useSessionsByCategory({
			eid: String(eid),
			cid: String(cid)
		});

	return (
		<AdminPageWrapper
			errors={[eventError, sessionCategoryError]}
			isLoading={
				isUserLoading || isEventLoading || isSessionCategoryLoading || isSessionsByCategoryLoading
			}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Viewing Session</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewSessionCategory
							sessionCategory={sessionCategory}
							eid={String(eid)}
							cid={String(cid)}
							sessions={sessionsByCategory}
							event={event}
							user={user}
							admin
						/>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewSessionCategoryPage;
