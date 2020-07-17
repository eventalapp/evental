import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import { eduAttendeePricing, priceAfterSale, proAttendeePricing, sale } from '../../utils/price';
import { EventalPro } from './EventalPro';
import { PromotionalOffer } from './PromotionalOffer';

type EventalProCardProps = {
	attendees: number;
	isEducation?: boolean;
	className?: string;
};

const EventalProCardPrice: React.FC<EventalProCardProps> = (props) => {
	const { attendees, isEducation = false } = props;

	if (sale.percentage > 0 || sale.flatAmount > 0) {
		return (
			<div className="flex flex-row items-end justify-center">
				<p className="inline-block">
					<span className="mr-2 text-lg font-medium leading-[1.2] tracking-tight text-gray-500 line-through md:text-2xl">
						<span className="align-top text-sm md:text-lg">$</span>
						{isEducation
							? eduAttendeePricing[attendees].price
							: proAttendeePricing[attendees].price}
					</span>
				</p>
				<p className="inline-block">
					<span className="text-3xl font-bold leading-[1] text-green-500 md:text-5xl">
						<span className="align-top text-xl md:text-2xl">$</span>
						{isEducation
							? priceAfterSale(eduAttendeePricing[attendees].price)
							: priceAfterSale(proAttendeePricing[attendees].price)}
					</span>
				</p>
			</div>
		);
	}

	return (
		<div className="mb-3 flex flex-row items-end justify-center">
			<p className="inline-block">
				<span className="text-3xl font-bold leading-[1] text-gray-700 md:text-5xl">
					<span className="align-top text-xl md:text-2xl">$</span>
					{isEducation ? eduAttendeePricing[attendees].price : proAttendeePricing[attendees].price}
				</span>
			</p>
		</div>
	);
};

export const EventalProCard: React.FC<EventalProCardProps> = (props) => {
	const { attendees, isEducation = false, children, className } = props;

	return (
		<div
			className={classNames(
				'my-3 flex min-h-[350px] max-w-[450px] flex-col items-center justify-between space-y-4 rounded border border-gray-300 bg-white p-5 shadow-sm',
				className
			)}
		>
			<EventalPro isEducation={isEducation} />

			<p className="text-gray-700">
				The {isEducation ? 'education/non-profit' : 'pro'} plan allows event organizers to create
				unlimited roles, sessions, venues, and pages. It also allows you to invite additional
				organizers to help you manage your event.
			</p>

			<div>
				<EventalProCardPrice attendees={attendees} isEducation={isEducation} />

				<PromotionalOffer />

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
