import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { Paragraph } from '../../../../../components/typography/Paragraph';
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

						<Paragraph className="text-gray-600">
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
