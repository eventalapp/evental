import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewAttendee } from '../../../../components/Attendees/ViewAttendee';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useAttendeeQuery } from '../../../../hooks/useAttendeeQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(aid));

	return (
		<>
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{attendeeError ? (
					<div>
						<p className="text-red-500">{attendeeError}</p>
					</div>
				) : (
					<ViewAttendee attendee={attendee} loading={isAttendeeLoading} />
				)}
			</Column>
		</>
	);
};

export default ViewAttendeePage;
