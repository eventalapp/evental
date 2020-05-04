import React from 'react';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

type Props = {
	eid: string;
	vid: string;
} & UseVenueQueryData;

export const ViewVenue: React.FC<Props> = (props) => {
	const { venue } = props;

	if (!venue) return null;

	return (
		<div>
			<div>
				{venue.address && (
					<div className="flex flex-row items-center mb-1">
						<FontAwesomeIcon
							fill="currentColor"
							className="w-5 h-5 mr-1.5"
							size="1x"
							icon={faLocationDot}
						/>
						<p>{venue.address}</p>
					</div>
				)}

				<p>{venue.description}</p>
			</div>
		</div>
	);
};
