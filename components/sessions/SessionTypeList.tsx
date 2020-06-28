import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
	sessionTypes?: Prisma.EventSessionType[];
};

export const SessionTypeList: React.FC<Props> = (props) => {
	const { eid, sessionTypes, admin = false } = props;

	if (sessionTypes && sessionTypes?.length === 0) {
		return <NotFound message="No session types found." />;
	}

	return (
		<div className="mt-3">
			{sessionTypes
				? sessionTypes.map((sessionType, i) => {
						return (
							<Link
								href={`/events/${eid}${admin ? '/admin' : ''}/sessions/types/${sessionType.slug}`}
								key={sessionType.id}
							>
								<a>
									<div
										className={classNames(
											'flex flex-row border-gray-200 bg-white',
											i !== sessionTypes.length - 1 && 'border-b'
										)}
									>
										<div className="-mx-3 flex grow flex-row flex-wrap items-center justify-between rounded-md p-3 hover:bg-gray-75">
											<div className="flex flex-row items-center justify-between">
												<div
													className="mr-3 h-3.5 w-3.5 rounded-full"
													style={{ backgroundColor: sessionType.color ?? '#888888' }}
												/>
												<div>
													<span className="text-xl">{sessionType.name}</span>
												</div>
											</div>

											<Tooltip side={'top'} message={`Click to view the ${sessionType.name} type`}>
												<div className="-m-2 flex items-center justify-center p-2">
													<FontAwesomeIcon
														fill="currentColor"
														size="1x"
														className="h-5 w-5 text-gray-500"
														icon={faChevronRight}
													/>
												</div>
											</Tooltip>
										</div>
									</div>
								</a>
							</Link>
						);
				  })
				: Array.apply(null, Array(5)).map((_, i) => (
						<div className="mb-4" key={i}>
							<Skeleton className="w-48 mb-2 h-5" />
							<div className="flex flex-row mb-3">
								<Skeleton className="w-24 mr-5 h-6" />
								<div className="w-full flex-row flex flex-wrap">
									<Skeleton className="w-48 mr-3 h-6 mb-2" />
									<Skeleton className="w-48 mr-3 h-6 mb-2" />
									<Skeleton className="w-48 mr-3 h-6 mb-2" />
								</div>
							</div>
						</div>
				  ))}
		</div>
	);
};
