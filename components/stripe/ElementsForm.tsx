import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { CURRENCY } from '../../config';
import { formatAmountForDisplay } from '../../utils/stripeHelpers';
import { Controller, useForm } from 'react-hook-form';
import Slider from '../radix/components/Slider';
import Link from 'next/link';
import { attendeesToPrice } from '../../utils/price';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { ErrorMessage } from '../form/ErrorMessage';
import { Label } from '../form/Label';

const CARD_OPTIONS = {
	iconStyle: 'solid' as const,
	style: {
		base: {
			'iconColor': '#0066FF',
			'color': '#111827',
			'fontWeight': '500',
			'fontFamily': 'Roboto, Open Sans, Segoe UI, sans-serif',
			'fontSize': '16px',
			'fontSmoothing': 'antialiased',
			':-webkit-autofill': {
				color: '#fce883'
			},
			'::placeholder': {
				color: '#111827'
			}
		},
		invalid: {
			iconColor: '#ef2961',
			color: '#ef2961'
		}
	}
};

const ElementsForm = () => {
	const { register, handleSubmit, watch, control } = useForm<{
		attendees: number;
		cardholderName: string;
		eventId: string;
	}>({ defaultValues: { attendees: 250 } });

	const attendeesWatcher = watch('attendees');
	const [payment, setPayment] = useState({ status: 'initial' });
	const [errorMessage, setErrorMessage] = useState('');
	const stripe = useStripe();
	const elements = useElements();

	const PaymentStatus = ({ status }: { status: string }) => {
		switch (status) {
			case 'processing':
			case 'requires_payment_method':
			case 'requires_confirmation':
				return <h2>Processing...</h2>;

			case 'requires_action':
				return <h2>Authenticating...</h2>;

			case 'succeeded':
				return <h2>Payment Succeeded 🥳</h2>;

			case 'error':
				return (
					<>
						<h2>Error 😭</h2>
						<p className="error-message">{errorMessage}</p>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(async (data, e) => {
					setPayment({ status: 'processing' });

					// Create a PaymentIntent with the specified amount.
					const response = await axios.post('/api/payment/intents', {
						amount: data.attendees,
						metadata: {
							eventId: 'test'
						}
					});
					setPayment(response.data.data);

					if (response.status === 500) {
						setPayment({ status: 'error' });
						setErrorMessage(response.data.data);
						return;
					}

					// Get a reference to a mounted CardElement. Elements knows how
					// to find your CardElement because there can only ever be one of
					// each type of element.
					const cardElement = elements!.getElement(CardElement);

					// Use your card Element with other Stripe.js APIs
					const { error, paymentIntent } = await stripe!.confirmCardPayment(
						response.data.data.client_secret,
						{
							payment_method: {
								card: cardElement!,
								billing_details: { name: data.cardholderName }
							}
						}
					);

					if (error) {
						setPayment({ status: 'error' });
						setErrorMessage(error.message ?? 'An unknown error occured');
					} else if (paymentIntent) {
						setPayment(paymentIntent);
					}
				})}
			>
				<div className="flex flex-col items-center space-y-3 my-8">
					<p className="text-lg">How many attendees do you expect?</p>
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
					{attendeesWatcher >= 5000 && (
						<p className="text-gray-600">
							More than 5,000 people?{' '}
							<Link href="/contact">
								<a className="text-primary font-medium">Ask us for a same-day quote.</a>
							</Link>
						</p>
					)}

					<p className="text-xl">
						{attendeesWatcher} Attendees (<strong>${attendeesToPrice(attendeesWatcher)}</strong>)
					</p>
				</div>

				<fieldset className="elements-style mb-5">
					<Label>Cardholder Name</Label>
					<Input
						placeholder="Cardholder name"
						className="elements-style"
						type="Text"
						{...register('cardholderName')}
						required
					/>

					<div className="FormRow elements-style mt-3">
						<Label>Card Details</Label>
						<CardElement
							className="w-full px-3 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary"
							options={CARD_OPTIONS}
							onChange={(e) => {
								if (e.error) {
									setPayment({ status: 'error' });
									setErrorMessage(e.error.message ?? 'An unknown error occured');
								}
							}}
						/>
						{payment.status === 'error' && errorMessage && (
							<ErrorMessage>{errorMessage}</ErrorMessage>
						)}
					</div>
				</fieldset>
				<div className="flex flex-row justify-end">
					<Button
						className="elements-style-background"
						type="submit"
						disabled={!['initial', 'succeeded', 'error'].includes(payment.status) || !stripe}
					>
						Checkout ({formatAmountForDisplay(attendeesToPrice(attendeesWatcher), CURRENCY)})
					</Button>
				</div>
			</form>
			<PaymentStatus status={payment.status} />
		</>
	);
};

export default ElementsForm;
