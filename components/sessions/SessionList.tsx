import Link from 'next/link';
import React from 'react';
import { UseSessionsQueryData } from '../../hooks/queries/useSessionsQuery';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { NotFound } from '../error/NotFound';
import { format } from 'date-fns';

type Props = {
	eid: string;
} & UseSessionsQueryData &
	UseOrganizerQueryData;

export const SessionList: React.FC<Props> = (props) => {
	const { eid, sessions, isOrganizerLoading, isOrganizer } = props;

	if (sessions && sessions?.length === 0) {
		return <NotFound message="No sessions found." />;
	}

	if (!sessions) return null;

	return (
		<div>
			{sessions.map((session) => {
				return (
					<div key={session.id} className="flex flex-row">
						<span className="text-gray-700 text-sm w-20 py-2 pr-3 text-right">
							{format(new Date(session.startDate), 'h:mm a OOO')}
						</span>
						<div
							key={session.id}
							className="py-2 flex flex-row justify-between flex-grow border-l-2 border-gray-200 pl-3 flex-wrap"
						>
							<div className="flex flex-row items-center justify-between">
								<div className="rounded-full mr-3 w-3 h-3 bg-gradient-to-r from-secondary-500 to-primary-500" />
								<div>
									<span className="text-xl">{session.name}</span>
								</div>
							</div>

							<div className="flex flex-row items-center">
								<Link href={`/events/${eid}/sessions/${session.slug}`} passHref>
									<LinkButton variant="primary">View</LinkButton>
								</Link>
								{!isOrganizerLoading && isOrganizer && (
									<Link href={`/events/${eid}/admin/sessions/${session.slug}/edit`} passHref>
										<LinkButton variant="primary" className="ml-3">
											Edit
										</LinkButton>
									</Link>
								)}
								{!isOrganizerLoading && isOrganizer && (
									<Link href={`/events/${eid}/admin/sessions/${session.slug}/delete`} passHref>
										<LinkButton variant="primary" className="ml-3">
											Delete
										</LinkButton>
									</Link>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
