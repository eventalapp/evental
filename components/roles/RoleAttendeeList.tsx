import Link from 'next/link';
import { capitalizeFirstLetter } from '../../utils/string';
import React from 'react';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { AttendeeList } from '../attendees/AttendeeList';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { ViewServerError } from '../ViewServerError';
import { FlexRowBetween } from '../layout/FlexRowBetween';

type Props = {
	eid: string;
	rid: string;
} & UseRoleAttendeesQueryData &
	UseOrganizerQueryData;

export const RoleAttendeeList: React.FC<Props> = (props) => {
	const {
		eid,
		rid,
		isRoleAttendeesLoading,
		role,
		roleAttendeesError,
		isOrganizerLoading,
		isOrganizerError,
		isOrganizer,
		attendees
	} = props;

	if (isOrganizerLoading || isRoleAttendeesLoading) {
		return <Loading />;
	}

	if (isOrganizerError || roleAttendeesError) {
		return <ViewServerError errors={[isOrganizerError, roleAttendeesError]} />;
	}

	if (!role || !attendees) {
		return <NotFound />;
	}

	if (attendees?.length === 0) {
		return (
			<div>
				{role && (
					<>
						<FlexRowBetween>
							<h2 className="text-2xl mb-3">
								{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
							</h2>
							<div>
								<div className="flex items-center flex-row">
									{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
										<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
											<LinkButton>Edit role</LinkButton>
										</Link>
									)}
									{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
										<Link href={`/events/${eid}/admin/roles/${rid}/delete`} passHref>
											<LinkButton className="ml-3">Delete role</LinkButton>
										</Link>
									)}
								</div>
							</div>
						</FlexRowBetween>

						<p>No {role.name.toLowerCase()}s found.</p>
					</>
				)}
			</div>
		);
	}

	return (
		<div>
			{attendees && role && (
				<>
					<FlexRowBetween>
						<h2 className="text-2xl my-3">
							{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
						</h2>
						<div className="flex items-center flex-row">
							{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
									<LinkButton>Edit role</LinkButton>
								</Link>
							)}
							{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/delete`} passHref>
									<LinkButton className="ml-3">Delete role</LinkButton>
								</Link>
							)}
						</div>
					</FlexRowBetween>

					<AttendeeList
						isOrganizerError={isOrganizerError}
						isOrganizerLoading={isOrganizerLoading}
						isOrganizer={isOrganizer}
						attendees={attendees}
						attendeesError={roleAttendeesError}
						isAttendeesLoading={isRoleAttendeesLoading}
						eid={eid}
					/>
				</>
			)}
		</div>
	);
};
