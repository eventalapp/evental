import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionCategoryWithCount } from '@eventalapp/shared/utils';

import { NotFound } from '../error/NotFound';
import Tooltip from '../primitives/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
	sessionCategories?: SessionCategoryWithCount[];
};

export const SessionCategoryList: React.FC<Props> = (props) => {
	const { eid, sessionCategories, admin = false } = props;

	if (sessionCategories && sessionCategories?.length === 0) {
		return <NotFound message="No session categories found." />;
	}

	return (
		<div className="mt-3">
			{sessionCategories
				? sessionCategories.map((sessionCategory, i) => {
						return (
							<Link
								href={`/events/${eid}${admin ? '/admin' : ''}/sessions/categories/${
									sessionCategory.slug
								}`}
								key={sessionCategory.id}
							>
								<a>
									<div
										className={classNames(
											'flex flex-row border-gray-200 bg-white',
											i !== sessionCategories.length - 1 && 'border-b'
										)}
									>
										<div className="-mx-3 flex grow flex-row flex-wrap items-center justify-between rounded-md p-3 hover:bg-gray-75">
											<div className="flex flex-row items-center justify-between">
												<div
													className="mr-3 h-3.5 w-3.5 rounded-full"
													style={{ backgroundColor: sessionCategory.color ?? '#888888' }}
												/>
												<div>
													<span className="block text-xl">{sessionCategory.name}</span>
													{sessionCategory.sessionCount > 0 ? (
														<Tooltip
															message={`This category has ${sessionCategory.sessionCount} session${
																sessionCategory.sessionCount > 1 ? 's' : ''
															}`}
														>
															<span className="text-sm font-normal text-gray-500">
																{sessionCategory.sessionCount} Sessions
															</span>
														</Tooltip>
													) : (
														<Tooltip message="This category has no sessions">
															<em className="text-sm font-normal text-gray-500">No Sessions</em>
														</Tooltip>
													)}
												</div>
											</div>

											<Tooltip side={'top'} message={`View the ${sessionCategory.name} category`}>
												<div className="-m-2 flex items-center justify-center p-2">
													<FontAwesomeIcon
														fill="currentColor"
														size="1x"
														className="h-5 w-5 text-gray-400"
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
						<Skeleton className="mb-4 h-12 w-full" key={i} />
				  ))}
		</div>
	);
};
