import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AttendeeList } from '../../../../components/Attendees/AttendeeList';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { ServerError } from '../../../../components/ServerError';
import { useRoleQuery } from '../../../../hooks/useRoleQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { attendees, role, isRoleLoading, roleError } = useRoleQuery(String(eid), String(rid));

	return (
		<>
			<Head>
				<title>Viewing Role: {rid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{roleError ? (
					<ServerError error={roleError} />
				) : (
					<AttendeeList
						eid={String(eid)}
						role={role}
						attendees={attendees}
						loading={isRoleLoading}
					/>
				)}
			</Column>
		</>
	);
};

export default ViewAttendeePage;
