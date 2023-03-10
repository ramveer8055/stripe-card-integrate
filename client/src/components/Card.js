import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StatusMessages, { useMessages } from './StatusMessages';

const Card = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [messages, addMessage] = useMessages();

    const handleSubmit = async (e) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            addMessage('Stripe.js has not yet loaded.');
            return;
        }

        const { error: backendError, clientSecret } = await fetch(
            'http://localhost:4242/payment',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodType: 'card',
                    currency: 'inr',
                }),
            }
        ).then((r) => r.json());

        if (backendError) {
            addMessage(backendError.message);
            return;
        }

        addMessage('Client secret returned');

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Jenny Rosen',
                },
            },
        })

        if (stripeError) {
            // Show error to your customer (e.g., insufficient funds)
            addMessage(stripeError.message);
            return;
        }

        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    };
    
    return (
        <>
            <h1>Card</h1>

            <form id="payment-form" onSubmit={handleSubmit}>
                <label htmlFor="card">Card</label>
                <CardElement id="card" />

                <button type="submit">Pay</button>
            </form>
            <StatusMessages messages={messages} />

        </>
    );
};

export default Card;