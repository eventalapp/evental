import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CURRENCY } from '../../config';
import { proAttendeesToPrice } from '../../utils/price';
import { formatAmountForDisplay } from '../../utils/stripeHelpers';
import { EventalProCard } from '../EventalProCard';
import { Button } from '../form/Button';
import Slider from '../radix/components/Slider';

type Props = { eid?: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const PurchaseProPlan: React.FC<Props> = (props) => {
	const { eid } = props;
	const { control, watch, handleSubmit } = useForm({ defaultValues: { attendees: 250, eid } });
	const stripe = useStripe();
	const attendees = watch('attendees');

	return (
		<form
			onSubmit={handleSubmit(async (data) => {
				const response = await axios.post('/api/payment/sessions', {
					attendees: data.attendees,
					eventId: data.eid
				});

				if (response.status === 500) {
					toast.error('Something went wrong. Please try again.');
				}

				if (response.status === 200 && response?.data?.data?.upgraded) {
					toast.success('Your event has been upgraded');
					return;
				}

				const { error } = await stripe!.redirectToCheckout({
					sessionId: response?.data?.data?.id
				});

				if (error) {
					toast.error(error.message ?? 'Something went wrong. Please try again.');
				}
			})}
		>
			<div className="flex flex-col items-center">
				<EventalProCard attendees={attendees}>
					<div className="flex flex-row justify-end">
						<Button type="submit">
							Purchase ({formatAmountForDisplay(proAttendeesToPrice(attendees), CURRENCY)})
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
