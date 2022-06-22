import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
} & UseVenuesQueryData;

export const VenueList: React.FC<Props> = (props) => {
	const { eid, venues, admin = false } = props;

	if (venues && venues.length === 0) {
		return <NotFound message="No venues found." />;
	}

	if (!venues) return null;

	return (
		<div>
			{venues.map((venue, i) => (
				<Link
					href={`/events/${eid}${admin ? '/admin' : ''}/venues/${venue.slug}`}
					key={venue.id}
					passHref
				>
					<a>
						<div className={classNames('border-gray-200', i !== venues.length - 1 && 'border-b')}>
							<div className="-mx-3 flex flex-row flex-wrap items-center justify-between rounded-md p-3 hover:bg-gray-75">
								<div>
									<span className="block text-lg">{venue.name}</span>{' '}
									{venue.address ? (
										<span className="text-sm font-normal text-gray-500">{venue.address}</span>
									) : (
										<em className="text-sm font-normal text-gray-500">{'No Address'}</em>
									)}
								</div>

								<Tooltip side={'top'} message={`Click to view the ${venue.name} venue`}>
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
			))}
		</div>
	);
};
