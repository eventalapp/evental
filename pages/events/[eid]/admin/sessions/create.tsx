import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { CreateSessionForm } from '../../../../../components/sessions/CreateSessionForm';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { Paragraph } from '../../../../../components/typography/Paragraph';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useSessionCategoriesQuery } from '../../../../../hooks/queries/useSessionCategoriesQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { sessionCategories, isSessionCategoriesLoading, sessionCategoriesError } =
		useSessionCategoriesQuery(String(eid));

	return (
		<AdminPageWrapper
			eid={String(eid)}
			errors={[sessionCategoriesError, venuesError, eventError]}
			isLoading={isSessionCategoriesLoading || isVenuesLoading || isEventLoading}
		>
			<PageWrapper>
				<Head>
					<title>Create Session</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Create Session</Heading>

						<Paragraph>A session is an event session that occurs during an event.</Paragraph>

						{venues && event && sessionCategories && (
							<CreateSessionForm
								eid={String(eid)}
								venues={venues}
								event={event}
								sessionCategories={sessionCategories}
							/>
						)}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateSessionPage;
