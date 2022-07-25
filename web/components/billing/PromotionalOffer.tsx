import { faPercent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { faBadge } from '@eventalapp/shared/utils/icons';

import { sale } from '../../utils/price';

export const PromotionalOffer = () => {
	if (sale.percentage > 0 || sale.flatAmount > 0) {
		return (
			<div className="my-3 flex flex-row items-center justify-center">
				<div className="relative mr-1 flex h-10 w-10 items-center justify-center">
					<FontAwesomeIcon
						fill="currentColor"
						className="absolute z-10 h-3.5 w-3.5 text-white"
						size="1x"
						icon={faPercent}
					/>
					<FontAwesomeIcon
						fill="currentColor"
						className="absolute h-8 w-8 animate-spin-slow text-green-500"
						size="1x"
						icon={faBadge}
					/>
				</div>
				<div>
					<p className="font-bold leading-[1.2] tracking-tight text-green-500">
						Promotional Offer!
					</p>
					{sale.percentage > 0 && (
						<p className="text-sm text-gray-700">
							{sale.percentage}% off until October 31st, 2022.
						</p>
					)}
					{sale.flatAmount > 0 && (
						<span className="text-sm text-gray-700">
							${sale.flatAmount} off until October 31st, 2022.
						</span>
					)}
				</div>
			</div>
		);
	}

	return null;
};
