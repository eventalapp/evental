import { faPercent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

import { faBadge } from '../icons';
import { eduAttendeePricing, priceAfterSale, proAttendeePricing, sale } from '../utils/const';

type EventalProCardProps = {
	attendees: number;
	isEducation?: boolean;
};

const EventalProCardPromotion: React.FC = () => {
	if (sale.percentage > 0 || sale.flatAmount > 0) {
		return (
			<div className="flex flex-row items-center my-3 justify-center">
				<div className="flex items-center justify-center w-10 h-10 relative mr-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="h-3.5 w-3.5 text-white absolute z-10"
						size="1x"
						icon={faPercent}
					/>
					<FontAwesomeIcon
						fill="currentColor"
						className="h-8 w-8 text-green-500 absolute animate-spin-slow"
						size="1x"
						icon={faBadge}
					/>
				</div>
				<div>
					<p className="text-green-500 font-bold leading-[1.2] tracking-tight">
						Promotional Offer!
					</p>
					{sale.percentage > 0 && (
						<p className="text-gray-700 text-sm">{sale.percentage}% off until August 31st, 2022.</p>
					)}
					{sale.flatAmount > 0 && (
						<span className="text-gray-700 text-sm">
							${sale.flatAmount} off until August 31st, 2022.
						</span>
					)}
				</div>
			</div>
		);
	}

	return null;
};

const EventalProCardPrice: React.FC<EventalProCardProps> = (props) => {
	const { attendees, isEducation = false } = props;

	if (sale.percentage > 0 || sale.flatAmount > 0) {
		return (
			<div className="flex flex-row justify-center items-end -ml-4">
				<p className="inline-block">
					<span className="mr-2 line-through text-lg md:text-2xl text-gray-500 font-medium leading-[1.2] tracking-tight">
						<span className="text-sm md:text-lg align-top">$</span>
						{isEducation
							? eduAttendeePricing[attendees].price
							: proAttendeePricing[attendees].price}
					</span>
				</p>
				<p className="inline-block">
					<span className="text-green-500 text-3xl font-bold md:text-5xl leading-[1]">
						<span className="text-xl md:text-2xl align-top">$</span>
						{isEducation
							? priceAfterSale(eduAttendeePricing[attendees].price)
							: priceAfterSale(proAttendeePricing[attendees].price)}
					</span>
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-row justify-center items-end -ml-4 mb-3">
			<p className="inline-block">
				<span className="text-gray-700 text-3xl font-bold md:text-5xl leading-[1]">
					<span className="text-xl md:text-2xl align-top">$</span>
					{isEducation ? eduAttendeePricing[attendees].price : proAttendeePricing[attendees].price}
				</span>
			</p>
		</div>
	);
};

export const EventalProCard: React.FC<EventalProCardProps> = (props) => {
	const { attendees, isEducation = false, children } = props;

	return (
		<div className="my-3 flex min-h-[350px] max-w-[450px] flex-col items-center justify-between space-y-4 rounded border border-gray-300 bg-white p-5 shadow-sm">
			<div className="flex flex-row items-center">
				<strong
					className="mr-2 font-display text-2xl font-bold tracking-tight"
					aria-label="evental homepage"
				>
					Evental
				</strong>
				<span className="rounded bg-primary py-1 px-2 text-xs font-medium text-white">
					{isEducation ? 'EDU' : 'PRO'}
				</span>
			</div>

			<p className="text-gray-700">
				The {isEducation ? 'education/non-profit' : 'pro'} plan allows event organizers to create
				unlimited roles, sessions, venues, and pages. It also allows you to invite additional
				organizers to help you manage your event.
			</p>

			<div>
				<EventalProCardPrice attendees={attendees} isEducation={isEducation} />

				<EventalProCardPromotion />

				<p className="text-center text-sm text-gray-600">
					Includes {attendees} attendees (
					{isEducation
						? priceAfterSale(eduAttendeePricing[attendees].price) / attendees < 1
							? `${Math.ceil(
									(priceAfterSale(eduAttendeePricing[attendees].price) / attendees) * 100
							  )}¢`
							: `$${(priceAfterSale(eduAttendeePricing[attendees].price) / attendees).toFixed(2)}`
						: priceAfterSale(proAttendeePricing[attendees].price) / attendees < 1
						? `${Math.ceil(
								(priceAfterSale(proAttendeePricing[attendees].price) / attendees) * 100
						  )}¢`
						: `$${(priceAfterSale(proAttendeePricing[attendees].price) / attendees).toFixed(2)}`}
					/per)
				</p>
			</div>

			{children}

			<Link href="/contact">
				<a className="text-sm text-gray-500">
					Need help? <span className="text-gray-800 underline">Contact us</span>
				</a>
			</Link>
		</div>
	);
};
