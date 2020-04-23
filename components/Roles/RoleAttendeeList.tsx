import type Prisma from '@prisma/client';
import Link from 'next/link';
import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import { capitalizeFirstLetter } from '../../utils/string';
import React from 'react';
import { LinkButton } from '../Form/LinkButton';
import { useOrganizerQuery } from '../../hooks/queries/useOrganizerQuery';
import { AttendeeList } from '../Attendees/AttendeeList';

interface Props {
	loading: boolean;
	attendees: EventMemberUser[] | undefined;
	eid: string;
	rid: string;
	role: Prisma.EventRole | undefined;
}

export const RoleAttendeeList: React.FC<Props> = (props) => {
	const { eid, rid, loading, attendees, role } = props;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	if (loading) {
		return (
			<div>
				<p>Attendees loading...</p>
			</div>
		);
	}

	if (attendees?.length === 0) {
		return (
			<div>
				{role && (
					<>
						<div className="flex flex-row justify-between">
							<h2 className="text-2xl mb-3">
								{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
							</h2>
							{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
									<LinkButton className="mr-3">Edit role</LinkButton>
								</Link>
							)}
						</div>

						<p>No {role.name.toLowerCase()}s found.</p>
					</>
				)}
			</div>
		);
	}

	return (
		<div>
			{attendees && role && (
				<div>
					<div className="flex flex-row justify-between">
						<h2 className="text-2xl my-3">
							{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
						</h2>
						{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
								<LinkButton className="mr-3">Edit role</LinkButton>
							</Link>
						)}
					</div>

					<AttendeeList loading={loading} attendees={attendees} eid={eid} />
				</div>
			)}
		</div>
	);
};
