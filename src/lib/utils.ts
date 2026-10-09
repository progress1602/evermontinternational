import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DUMMY_USER = {
  id: 'u1',
  fullName: 'Alexander Sterling',
  email: 'sterling@evermontinternational.com',
  accountNumber: '5021938476',
  balance: 145820.50,
  status: 'Active',
  createdAt: '2024-01-15'
};

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Deposit Approved', message: 'Your $5,000 deposit has been confirmed by the clearing house.', type: 'success', time: '2h ago' },
  { id: 2, title: 'Security Alert', message: 'A new node connection was detected from London, UK. If this was not you, please freeze your account immediately.', type: 'warning', time: '5h ago' },
  { id: 3, title: 'Wallet Injection', message: 'Received $3,200 via Instant Wire Protocol. Your updated balance is now available for global settlement.', type: 'success', time: '8h ago' },
  { id: 4, title: 'Identity Verified', message: 'Your sovereign identity packet has been validated. You now have full access to high-limit transfers.', type: 'success', time: '12h ago' },
  { id: 5, title: 'System Protocol Update', message: 'Secure Node v4.0 is now live. Enhanced encryption layers have been deployed across your assets.', type: 'info', time: '1d ago' },
  { id: 6, title: 'Payment Scheduled', message: 'Monthly premium insurance payment of $450 is scheduled for tomorrow.', type: 'info', time: '1d ago' },
  { id: 7, title: 'Transaction Rejected', message: 'Outgoing transfer of $15,000 was paused due to missing KYC document packet.', type: 'error', time: '2d ago' },
  { id: 8, title: 'Welcome to Evermont International', message: 'Thank you for choosing sovereign banking. Your account is now active on the global ledger.', type: 'success', time: '3d ago' },
];

export const MOCK_TRANSACTIONS = [
  { id: 'tx1', type: 'Deposit', amount: 5000, status: 'Approved', date: '2024-04-25', description: 'Wire Transfer' },
  { id: 'tx2', type: 'Withdrawal', amount: 1200, status: 'Pending', date: '2024-04-27', description: 'ATM Withdrawal' },
  { id: 'tx3', type: 'Transfer', amount: 450, status: 'Rejected', date: '2024-04-20', description: 'To: Sarah West' },
  { id: 'tx4', type: 'Deposit', amount: 10000, status: 'Approved', date: '2024-04-10', description: 'Salary Bonus' },
];
