import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PurchaseProPayload, PurchaseProSchema } from '@eventalapp/shared/utils';
import { CURRENCY } from '@eventalapp/shared/utils/config';

import { useUpgradeEvent } from '../../hooks/mutations/useUpgradeEvent';
import { priceAfterSale, proAttendeesToPrice } from '../../utils/price';
import { formatAmountForDisplay } from '../../utils/stripe';
import { Button } from '../primitives/Button';
import Slider from '../primitives/Slider';
import { EventalProCard } from './EventalProCard';

type Props = { eid?: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const PurchaseProPlan: React.FC<Props> = (props) => {
	const { eid } = props;
	const { control, watch, handleSubmit } = useForm<PurchaseProPayload>({
		defaultValues: { attendees: 250, eventId: eid },
		resolver: zodResolver(PurchaseProSchema)
	});
	const attendees = watch('attendees');
	const { upgradeEventMutation } = useUpgradeEvent(String(eid));

	return (
		<form
			onSubmit={handleSubmit(async (data) => {
				upgradeEventMutation.mutate(data);
			})}
		>
			<div className="flex flex-col items-center">
				<EventalProCard attendees={attendees}>
					<div className="flex flex-row justify-end">
						<Button type="submit" variant="primary">
							Purchase (
							{formatAmountForDisplay(priceAfterSale(proAttendeesToPrice(attendees)), CURRENCY)})
						</Button>
					</div>
				</EventalProCard>

				<div className="mt-4 flex flex-col items-center space-y-3">
					<p className="text-lg font-medium">How many attendees are you expecting?</p>
					<Controller
						control={control}
						name="attendees"
						render={({ field }) => (
							<Slider
								onChange={(val) => {
									field.onChange(val);
								}}
								value={field.value}
								max={5000}
								min={250}
								step={250}
							/>
						)}
					/>

					{attendees >= 5000 && (
						<p className="text-gray-600">
							Expecting more than 5,000 people?{' '}
							<Link href="/contact">
								<a className="font-medium text-primary">Ask us for a same-day quote.</a>
							</Link>
						</p>
					)}

					<p className="text-xl">
						<strong>{attendees}</strong> Attendees
					</p>
				</div>
			</div>
		</form>
	);
};
