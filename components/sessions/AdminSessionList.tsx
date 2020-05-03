import Link from 'next/link';
import React from 'react';
import { UseSessionsQueryData } from '../../hooks/queries/useSessionsQuery';
import { NotFound } from '../error/NotFound';
import { format } from 'date-fns';

type Props = {
	eid: string;
} & UseSessionsQueryData;

export const AdminSessionList: React.FC<Props> = (props) => {
	const { eid, sessions } = props;

	if (sessions && sessions?.length === 0) {
		return <NotFound message="No sessions found." />;
	}

	if (!sessions) return null;

	return (
		<div>
			{sessions.map((session) => {
				return (
					<Link href={`/events/${eid}/sessions/${session.slug}`} key={session.id} passHref>
						<a>
							<div className="flex flex-row p-3 mb-3 bg-gray-75 rounded-md">
								<span className="text-gray-700 text-sm w-20 pr-3 text-right">
									{format(new Date(session.startDate), 'h:mm a OOO')}
								</span>
								<div
									key={session.id}
									className="flex flex-row justify-between flex-grow border-l-2 border-gray-200 pl-3 flex-wrap"
								>
									<div className="flex flex-row items-center justify-between">
										<div className="rounded-full mr-3 w-3 h-3 bg-gradient-to-r from-secondary-500 to-primary-500" />
										<div>
											<span className="text-xl">{session.name}</span>
										</div>
									</div>
								</div>
							</div>
						</a>
					</Link>
				);
			})}
		</div>
	);
};
