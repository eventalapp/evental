import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/layout/SidebarWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../components/primitives/Paragraph';
import { CreateVenueForm } from '../../../../../components/venues/CreateVenueForm';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

	return (
		<AdminPageWrapper eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Create venue</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Create Venue</Heading>

						<Paragraph className="text-gray-600 mb-3">
							A venue is a location that a session is taking place. For example, a venue might be a
							conference room, a meeting room, or a hotel room.
						</Paragraph>

						<CreateVenueForm eid={String(eid)} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateSessionPage;
