import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CURRENCY } from '../../config';
import { proAttendeePricing } from '../../utils/const';
import { proAttendeesToPrice } from '../../utils/price';
import { formatAmountForDisplay } from '../../utils/stripeHelpers';
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

				const { error } = await stripe!.redirectToCheckout({
					sessionId: response.data.data.id
				});

				if (error) {
					toast.error(error.message ?? 'Something went wrong. Please try again.');
				}
			})}
		>
			<div className="flex flex-col items-center">
				<div className="bg-white border-gray-300 border rounded shadow-sm p-5 flex flex-col justify-between items-center space-y-4 max-w-[450px] min-h-[350px] my-3">
					<div className="flex flex-row items-center">
						<strong
							className="text-2xl tracking-tight font-bold font-display mr-2"
							aria-label="evental homepage"
						>
							Evental
						</strong>
						<span className="bg-primary text-white px-2 py-1 font-medium text-xs rounded">PRO</span>
					</div>

					<p className="text-gray-700">
						The pro plan allows event organizers to create unlimited roles, sessions, venues, and
						pages. It also allows you to invite additional organizers to help you manage your event.
					</p>

					<div>
						<p className="font-bold text-2xl md:text-3xl text-center">
							<span className="align-text-top text-lg text-gray-700 mr-0.5">$</span>
							{proAttendeePricing[attendees].price}
						</p>
						<p className="text-gray-600 text-sm text-center">
							Includes {attendees} attendees (
							{proAttendeePricing[attendees].perAttendeePrice < 1
								? `${Math.ceil(proAttendeePricing[attendees].perAttendeePrice * 100)}¢`
								: `$${proAttendeePricing[attendees].perAttendeePrice.toFixed(2)}`}
							/per)
						</p>
					</div>

					<div className="flex flex-row justify-end">
						<Button className="elements-style-background" type="submit">
							Purchase ({formatAmountForDisplay(proAttendeesToPrice(attendees), CURRENCY)})
						</Button>
					</div>

					<Link href="/contact">
						<a className="text-sm text-gray-500">
							Need help? <span className="text-gray-800 underline">Contact us</span>
						</a>
					</Link>
				</div>

				<div className="flex flex-col items-center space-y-3 mt-4">
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
								<a className="text-primary font-medium">Ask us for a same-day quote.</a>
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
