import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Card from './components/Card';

const stripePromise = loadStripe('pk_test_51M7cgbSCsJ4hXY5D4RZjbQqfAS33oukABWjY1tVW6WYNf1uyWAU9TlSNSt1wDd34kAjv6ARbCnvGGQIOocIb44JC00E69mqNqj');

function App() {
  return (
    <>
      <Elements stripe={stripePromise} >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Card/>} />
          </Routes>
        </BrowserRouter>
      </Elements>
    </>
  );
}

export default App;
