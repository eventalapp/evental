import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeleteSessionForm } from '../../../../../../components/sessions/DeleteSessionForm';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../../components/typography/Heading';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';

const DeleteSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));

	return (
		<AdminPageWrapper eid={String(eid)} isLoading={isSessionLoading} errors={[sessionError]}>
			<PageWrapper>
				<Head>
					<title>Delete Session</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						{session && (
							<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
								You are about to delete an session ("{session.name}")
							</p>
						)}

						<Heading>Delete Session</Heading>

						{session && <DeleteSessionForm session={session} eid={String(eid)} sid={String(sid)} />}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default DeleteSessionPage;
