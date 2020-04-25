import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { UseAttendeesQueryData } from '../../hooks/queries/useAttendeesQuery';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';
import { ServerError } from '../ServerError';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { LinkButton } from '../Form/LinkButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';

type Props = {
	eid: string;
} & UseAttendeesQueryData &
	UseOrganizerQueryData;

export const AttendeeList: React.FC<Props> = (props) => {
	const { eid, attendees, isAttendeesLoading, attendeesError } = props;

	if (isAttendeesLoading) {
		return <Loading />;
	}

	if (!attendees || attendees?.length === 0) {
		return <NotFound />;
	}

	if (attendeesError) {
		return <ServerError errors={[attendeesError]} />;
	}

	return (
		<div>
			<ul className="flex flex-row flex-wrap flex-start items-center">
				{attendees.map(
					(attendee) =>
						attendee &&
						attendee.user &&
						attendee.role && (
							<li key={attendee.id} className="w-32">
								<Link href={`/events/${eid}/attendees/${attendee.slug}`}>
									<a className="flex items-center justify-center flex-col">
										<div className="h-16 w-16 relative">
											<Image
												alt={String(attendee.name)}
												src={String(attendee.user.image)}
												className="rounded-full"
												layout="fill"
											/>
										</div>
										<span>{attendee.name}</span>
										<span className="block text-gray-700">
											{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}
										</span>
									</a>
								</Link>
								<Link href={`/events/${eid}/admin/attendees/${attendee.slug}/edit`} passHref>
									<LinkButton className="mr-3">
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faCog} />
									</LinkButton>
								</Link>
								<Link href={`/events/${eid}/admin/attendees/${attendee.slug}/delete`} passHref>
									<LinkButton className="mr-3">
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faTrash} />
									</LinkButton>
								</Link>
							</li>
						)
				)}
			</ul>
		</div>
	);
};
