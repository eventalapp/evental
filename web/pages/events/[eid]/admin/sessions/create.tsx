import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useEvent, useSessionCategories, useVenues } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../components/primitives/Paragraph';
import { CreateSessionForm } from '../../../../../components/sessions/CreateSessionForm';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: venues,
		isLoading: isVenuesLoading,
		error: venuesError
	} = useVenues({ eid: String(eid) });
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });
	const {
		data: sessionCategories,
		isLoading: isSessionCategoriesLoading,
		error: sessionCategoriesError
	} = useSessionCategories({ eid: String(eid) });

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

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Create Session</Heading>

						<Paragraph className="text-gray-600">
							A session is an event session that occurs during an event. For example, a session
							could be a talk, a workshop, or a panel.
						</Paragraph>

						{venues && event && sessionCategories && (
							<CreateSessionForm
								eid={String(eid)}
								venues={venues}
								event={event}
								sessionCategories={sessionCategories}
							/>
						)}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateSessionPage;
