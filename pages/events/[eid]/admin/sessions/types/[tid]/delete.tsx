import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { DeleteSessionCategoryForm } from '../../../../../../../components/sessions/DeleteSessionCategoryForm';
import { Heading } from '../../../../../../../components/typography/Heading';
import { useDeleteSessionCategoryMutation } from '../../../../../../../hooks/mutations/useDeleteSessionCategoryMutation';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoryQuery } from '../../../../../../../hooks/queries/useSessionCategoryQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';

const DeleteSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { eid, cid } = router.query;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { sessionCategory, isSessionCategoryLoading, sessionCategoryError } =
		useSessionCategoryQuery(String(eid), String(cid));
	const { deleteSessionCategoryMutation } = useDeleteSessionCategoryMutation(
		String(eid),
		String(cid)
	);
	const { user } = useUser();
	const { event, eventError } = useEventQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (sessionCategoryError) {
		return <NotFoundPage message="Session type not found" />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete SessionCategory</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				{sessionCategory && (
					<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						You are about to delete a session type ("{sessionCategory.name}")
					</p>
				)}

				<Heading>Delete Session Type</Heading>

				<DeleteSessionCategoryForm
					sessionCategory={sessionCategory}
					isSessionCategoryLoading={isSessionCategoryLoading}
					sessionCategoryError={sessionCategoryError}
					deleteSessionCategoryMutation={deleteSessionCategoryMutation}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default DeleteSessionCategoryPage;
