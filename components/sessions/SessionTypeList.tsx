import Prisma from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import { NotFound } from '../error/NotFound';

type Props = {
	eid: string;
	admin?: boolean;
	sessionTypes: Prisma.EventSessionType[];
};

export const SessionTypeList: React.FC<Props> = (props) => {
	const { eid, sessionTypes, admin = false } = props;

	if (sessionTypes && sessionTypes?.length === 0) {
		return <NotFound message="No session types found." />;
	}

	if (!sessionTypes) return null;

	if (admin) {
		return (
			<div>
				{sessionTypes.map((sessionType, i) => {
					return (
						<Link
							href={`/events/${eid}/admin/sessions/types/${sessionType.slug}`}
							key={sessionType.id}
							passHref
						>
							<a>
								<div
									className={classNames(
										'flex flex-row border-gray-200 bg-white p-3',
										i !== sessionTypes.length - 1 && 'border-b-2'
									)}
								>
									<div className="flex grow flex-row flex-wrap justify-between">
										<div className="flex flex-row items-center justify-between">
											<div
												className="mr-3 h-4 w-4 rounded-full"
												style={{ backgroundColor: sessionType.color ?? '#888888' }}
											/>
											<div>
												<span className="text-xl">{sessionType.name}</span>
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
	}

	return (
		<div className="mt-3">
			{sessionTypes.map((sessionType, i) => {
				return (
					<Link href={`/events/${eid}/sessions/${sessionType.slug}`} key={sessionType.id}>
						<a>
							<div
								className={classNames(
									'flex flex-row border-gray-200 bg-white p-3',
									i !== sessionTypes.length - 1 && 'border-b-2'
								)}
							>
								<span className="w-20 py-2 pr-3 text-right text-sm text-gray-700">
									{sessionType.color}
								</span>
								<div className="flex grow flex-row flex-wrap justify-between border-l-2 border-gray-200 py-2 pl-3">
									<div className="flex flex-row items-center justify-between">
										<div
											className="mr-3 h-4 w-4 rounded-full"
											style={{ backgroundColor: sessionType.color ?? '#888888' }}
										/>
										<div>
											<span className="text-xl">{sessionType.name}</span>
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
