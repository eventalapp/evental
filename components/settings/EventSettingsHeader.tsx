import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Prisma from '@prisma/client';

export const EventSettingsHeader: React.FC<{ event: Prisma.Event }> = (props) => {
	const { event } = props;

	return (
		<div className="flex flex-row items-center mb-3">
			<div className="flex-shrink-0 relative w-8 h-8 md:w-16 md:h-16 rounded-md mr-2 md:mr-4 border-2 border-gray-100">
				<Image
					alt={event.name}
					src={
						event.image
							? `https://cdn.evental.app${event.image}`
							: `https://cdn.evental.app/images/default-event.jpg`
					}
					layout="fill"
					className="rounded-md"
				/>
			</div>

			<div>
				<span className="text-gray-500 text-xs block">SETTINGS</span>
				<h1 className="text-3xl font-bold leading-tight">{event?.name}</h1>

				{event?.location && (
					<div className="flex flex-row items-center mb-1">
						<FontAwesomeIcon
							fill="currentColor"
							className="w-5 h-5 mr-1.5"
							size="1x"
							icon={faLocationDot}
						/>
						<p>{event?.location}</p>
					</div>
				)}
			</div>
		</div>
	);
};
