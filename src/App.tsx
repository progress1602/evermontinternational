/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { AnimatePresence } from 'motion/react';
import LandingPage from '@/src/pages/LandingPage';
import Features from '@/src/pages/Features';
import CardsPage from '@/src/pages/CardsPage';
import Security from '@/src/pages/Security';
import About from '@/src/pages/About';
import Contact from '@/src/pages/Contact';
import Login from '@/src/pages/auth/Login';
import Register from '@/src/pages/auth/Register';
import PINEntry from '@/src/pages/auth/PINEntry';
import DashboardLayout from '@/src/components/dashboard/DashboardLayout';
import DashboardHome from '@/src/pages/dashboard/DashboardHome';
import { useStore } from '@/src/lib/store';

function ProtectedRoute({ children, requirePin = true }: { children: React.ReactNode, requirePin?: boolean }) {
  const { isAuthenticated, isPinVerified } = useStore();
  
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (requirePin && !isPinVerified) return <Navigate to="/auth/pin-entry" replace />;
  
  return <>{children}</>;
}
import Deposit from '@/src/pages/dashboard/Deposit';
import Withdraw from '@/src/pages/dashboard/Withdraw';
import Transfer from '@/src/pages/dashboard/Transfer';
// import PayBills from '@/src/pages/dashboard/PayBills';
import WireTransfer from '@/src/pages/dashboard/WireTransfer';
import Loans from '@/src/pages/dashboard/Loans';
import TaxRefund from '@/src/pages/dashboard/TaxRefund';
import Charity from '@/src/pages/dashboard/Charity';
import Grant from '@/src/pages/dashboard/Grant';
import PaymentMethods from '@/src/pages/dashboard/PaymentMethods';
import Transactions from '@/src/pages/dashboard/Transactions';
import Cards from '@/src/pages/dashboard/Cards';
import Help from '@/src/pages/dashboard/Help';
import Settings from '@/src/pages/dashboard/Settings';
import Accounts from '@/src/pages/dashboard/Accounts';
import Notifications from '@/src/pages/dashboard/Notifications';
// import Verification from '@/src/pages/dashboard/Verification';
import Profile from '@/src/pages/dashboard/Profile';
import SecurityDashboard from '@/src/pages/dashboard/Security';

export default function App() {
  React.useEffect(() => {
    // Warm up the GraphQL server backend immediately on SPA mount to resolve any Render cold starts proactively
    fetch('https://manual-bank.onrender.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __schema { queryType { name } } }' })
    }).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/security" element={<Security />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/pin-entry" element={<PINEntry />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="withdraw" element={<Withdraw />} />
            {/* <Route path="bills" element={<PayBills />} /> */}
            <Route path="wire" element={<WireTransfer />} />
            <Route path="loans" element={<Loans />} />
            <Route path="tax-refund" element={<TaxRefund />} />
            <Route path="charity" element={<Charity />} />
            <Route path="grants" element={<Grant />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="cards" element={<Cards />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="notifications" element={<Notifications />} />
            {/* <Route path="verification" element={<Verification />} /> */}
            <Route path="profile" element={<Profile />} />
            <Route path="security" element={<SecurityDashboard />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
