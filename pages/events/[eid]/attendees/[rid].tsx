import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AttendeeList } from '../../../../components/Attendees/AttendeeList';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useRoleAttendeesQuery } from '../../../../hooks/useRoleAttendeesQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { roleAttendees, isRoleAttendeesLoading } = useRoleAttendeesQuery(String(eid), String(rid));

	return (
		<>
			<Head>
				<title>Viewing Role: {rid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<AttendeeList
					eid={String(eid)}
					attendees={roleAttendees}
					loading={isRoleAttendeesLoading}
				/>
			</Column>
		</>
	);
};

export default ViewAttendeePage;
