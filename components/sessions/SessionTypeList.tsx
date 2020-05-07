import Link from 'next/link';
import React from 'react';
import { NotFound } from '../error/NotFound';
import classNames from 'classnames';
import Prisma from '@prisma/client';

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
										'flex flex-row p-3 bg-white border-gray-200',
										i !== sessionTypes.length - 1 && 'border-b '
									)}
								>
									<div className="flex flex-row justify-between flex-grow flex-wrap">
										<div className="flex flex-row items-center justify-between">
											<div
												className="rounded-full mr-3 w-3 h-3"
												style={{ backgroundColor: sessionType.color }}
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
									'flex flex-row p-3 bg-white border-gray-200',
									i !== sessionTypes.length - 1 && 'border-b '
								)}
							>
								<span className="text-gray-700 text-sm w-20 py-2 pr-3 text-right">
									{sessionType.color}
								</span>
								<div className="py-2 flex flex-row justify-between flex-grow border-l-2 border-gray-200 pl-3 flex-wrap">
									<div className="flex flex-row items-center justify-between">
										<div className="rounded-full mr-3 w-3 h-3 bg-gradient-to-r from-secondary-500 to-primary-500" />
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
