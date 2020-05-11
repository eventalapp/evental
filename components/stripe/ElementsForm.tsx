import React, { useState } from 'react';
import CustomDonationInput from './CustomDonationInput';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AMOUNT_STEP, CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../config';
import { formatAmountForDisplay } from '../../utils/stripeHelpers';

const CARD_OPTIONS = {
	iconStyle: 'solid' as const,
	style: {
		base: {
			'iconColor': '#6772e5',
			'color': '#6772e5',
			'fontWeight': '500',
			'fontFamily': 'Roboto, Open Sans, Segoe UI, sans-serif',
			'fontSize': '16px',
			'fontSmoothing': 'antialiased',
			':-webkit-autofill': {
				color: '#fce883'
			},
			'::placeholder': {
				color: '#6772e5'
			}
		},
		invalid: {
			iconColor: '#ef2961',
			color: '#ef2961'
		}
	}
};

const ElementsForm = () => {
	const [input, setInput] = useState({
		customDonation: Math.round(MAX_AMOUNT / AMOUNT_STEP),
		cardholderName: ''
	});
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

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setInput({
			...input,
			[e.currentTarget.name]: e.currentTarget.value
		});

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		// Abort if form isn't valid
		if (!e.currentTarget.reportValidity()) return;
		setPayment({ status: 'processing' });

		// Create a PaymentIntent with the specified amount.
		const response = await axios.post('/api/payment/intents', {
			amount: input.customDonation,
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
					billing_details: { name: input.cardholderName }
				}
			}
		);

		if (error) {
			setPayment({ status: 'error' });
			setErrorMessage(error.message ?? 'An unknown error occured');
		} else if (paymentIntent) {
			setPayment(paymentIntent);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<CustomDonationInput
					className="elements-style"
					name="customDonation"
					value={input.customDonation}
					min={MIN_AMOUNT}
					max={MAX_AMOUNT}
					step={AMOUNT_STEP}
					currency={CURRENCY}
					onChange={handleInputChange}
				/>

				<fieldset className="elements-style">
					<legend>Your payment details:</legend>
					<input
						placeholder="Cardholder name"
						className="elements-style"
						type="Text"
						name="cardholderName"
						onChange={handleInputChange}
						required
					/>
					<div className="FormRow elements-style">
						<CardElement
							options={CARD_OPTIONS}
							onChange={(e) => {
								if (e.error) {
									setPayment({ status: 'error' });
									setErrorMessage(e.error.message ?? 'An unknown error occured');
								}
							}}
						/>
					</div>
				</fieldset>
				<button
					className="elements-style-background"
					type="submit"
					disabled={!['initial', 'succeeded', 'error'].includes(payment.status) || !stripe}
				>
					Donate {formatAmountForDisplay(input.customDonation, CURRENCY)}
				</button>
			</form>
			<PaymentStatus status={payment.status} />
		</>
	);
};

export default ElementsForm;
