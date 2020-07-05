import { faPercent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { faBadge } from '../../icons';
import { sale } from '../../utils/const';

export const PromotionalOffer = () => {
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
						<p className="text-gray-700 text-sm">
							{sale.percentage}% off until October 31st, 2022.
						</p>
					)}
					{sale.flatAmount > 0 && (
						<span className="text-gray-700 text-sm">
							${sale.flatAmount} off until October 31st, 2022.
						</span>
					)}
				</div>
			</div>
		);
	}

	return null;
};
