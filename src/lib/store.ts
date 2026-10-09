import { create } from 'zustand';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Transfer' | 'Payment' | 'Wire' | 'Zelle' | 'Bill' | 'Donation';
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
  description: string;
  recipient?: string;
  method?: string;
}

interface Card {
  id: string;
  name: string;
  number: string;
  expiry: string;
  type: 'Virtual' | 'Sovereign' | 'Elite' | 'Physical';
  status: 'active' | 'frozen' | 'pending';
  balance: number;
}

interface Account {
  id: string;
  name: string;
  number: string;
  type: 'Savings' | 'Checking' | 'Credit';
  balance: number;
  status: 'Active' | 'Pending';
}

interface UserState {
  id: string;
  balance: number;
  primaryBalance: number;
  tertiaryBalance: number;
  secondaryBalance: number;
  totalBalance: number;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  accountNumber: string;
  memberSince: string;
  currency: string;
  accountType: string;
  occupation: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  ssn: string;
  profilePic: string | null;
  pin: string;
  tier: string;
  cardActivation: {
    [key: number]: {
      status: 'idle' | 'pending' | 'active';
      requestedAt: number | null;
      depositAmount: number;
    }
  };
  transactions: Transaction[];
  cards: Card[];
  accounts: Account[];
  theme: 'dark' | 'light';
  isAuthenticated: boolean;
  isPinVerified: boolean;
  toast: { show: boolean; message: string; type: 'success' | 'error' | 'info'; title?: string } | null;
  isLockModalOpen: boolean;
  
  showToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
  hideToast: () => void;
  setLockModalOpen: (open: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  setPinVerified: (status: boolean) => void;
  deposit: (amount: number, method: string, status?: Transaction['status']) => void;
  withdraw: (amount: number, method: string, address: string) => void;
  transfer: (amount: number, recipient: string, type?: Transaction['type']) => void;
  orderCard: (type: Card['type'], name: string) => void;
  toggleCardStatus: (cardId: string) => void;
  toggleTheme: () => void;
  updateUser: (data: Partial<UserState>) => void;
  setGraphQLUser: (user: any) => void;
  updateCardActivation: (cardIdx: number, data: Partial<UserState['cardActivation'][number]>) => void;
  logout: () => void;
}

export const useStore = create<UserState>((set) => ({
  id: "",
  balance: 0.00,
  primaryBalance: 0.00,
  tertiaryBalance: 0.00,
  secondaryBalance: 0.00,
  totalBalance: 0.00,
  fullName: "Henry David",
  firstName: "Henry",
  lastName: "David",
  email: "henrydavid1602@gmail.com",
  phone: "",
  username: "henrydavid",
  accountNumber: "9909219487",
  memberSince: "May 2026",
  currency: "USD",
  accountType: "Savings/Checking",
  occupation: "Private Investor",
  country: "United States",
  address: "123 Park Avenue",
  city: "London",
  state: "Greater London",
  zip: "EC1A 1BB",
  dob: "1990-01-01",
  ssn: "",
  profilePic: null,
  pin: localStorage.getItem('user_pin') || "0000",
  tier: "Member",
  theme: 'dark',
  isAuthenticated: !!localStorage.getItem('token'),
  isPinVerified: localStorage.getItem('is_pin_verified') === 'true',
  cardActivation: {
    0: { status: 'idle', requestedAt: null, depositAmount: 500 },
    1: { status: 'idle', requestedAt: null, depositAmount: 1000 },
    2: { status: 'idle', requestedAt: null, depositAmount: 1500 },
  },
  transactions: [],
  cards: [],
  accounts: [
    { id: 'acc1', name: '360 Checking', number: '1424', type: 'Checking', balance: 0.00, status: 'Active' },
    { id: 'acc2', name: '360 Checking', number: '6065', type: 'Checking', balance: 0.00, status: 'Active' },
    { id: 'acc3', name: '360 Tertiary Checking', number: '7821', type: 'Savings', balance: 0.00, status: 'Active' },
    { id: 'acc4', name: 'QUICKSILVER Credit', number: '4432', type: 'Credit', balance: 0.00, status: 'Active' },
  ],
  toast: null,
  isLockModalOpen: false,

  showToast: (message, type = 'info', title) => {
    set({ toast: { show: true, message, type, title } });
  },
  hideToast: () => set({ toast: null }),
  setLockModalOpen: (open) => set({ isLockModalOpen: open }),

  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setPinVerified: (status) => {
    if (status) {
      localStorage.setItem('is_pin_verified', 'true');
    } else {
      localStorage.removeItem('is_pin_verified');
    }
    set({ isPinVerified: status });
  },
  deposit: (amount, method, status = 'Pending') => set((state) => {
    const isApproved = status === 'Approved';
    const nextBalance = isApproved ? state.balance + amount : state.balance;
    const nextTotalBalance = isApproved ? state.totalBalance + amount : state.totalBalance;
    const nextPrimary = isApproved ? state.primaryBalance + amount : state.primaryBalance;
    return {
      balance: nextBalance,
      totalBalance: nextTotalBalance,
      primaryBalance: nextPrimary,
      accounts: state.accounts.map(acc => 
        acc.id === 'acc1' ? { ...acc, balance: nextPrimary } :
        acc.id === 'acc4' ? { ...acc, balance: nextTotalBalance } : acc
      ),
      transactions: [
        { id: `TX-${Math.floor(Math.random() * 10000)}`, type: 'Deposit', amount, status, date: 'Just now', description: `Deposit via ${method}`, method },
        ...state.transactions
      ]
    };
  }),

  withdraw: (amount, method, address) => set((state) => {
    const nextBalance = state.balance - amount;
    const nextTotalBalance = state.totalBalance - amount;
    const nextPrimary = Math.max(0, state.primaryBalance - amount);
    return {
      balance: nextBalance,
      totalBalance: nextTotalBalance,
      primaryBalance: nextPrimary,
      accounts: state.accounts.map(acc => 
        acc.id === 'acc1' ? { ...acc, balance: nextPrimary } :
        acc.id === 'acc4' ? { ...acc, balance: nextTotalBalance } : acc
      ),
      transactions: [
        { id: `TX-${Math.floor(Math.random() * 10000)}`, type: 'Withdraw', amount, status: 'Pending', date: 'Just now', description: `Withdrawal to ${address}`, method },
        ...state.transactions
      ]
    };
  }),

  transfer: (amount, recipient, type = 'Transfer') => set((state) => {
    const nextBalance = state.balance - amount;
    const nextTotalBalance = state.totalBalance - amount;
    const nextPrimary = Math.max(0, state.primaryBalance - amount);
    return {
      balance: nextBalance,
      totalBalance: nextTotalBalance,
      primaryBalance: nextPrimary,
      accounts: state.accounts.map(acc => 
        acc.id === 'acc1' ? { ...acc, balance: nextPrimary } :
        acc.id === 'acc4' ? { ...acc, balance: nextTotalBalance } : acc
      ),
      transactions: [
        { id: `TX-${Math.floor(Math.random() * 10000)}`, type, amount, status: 'Approved', date: 'Just now', description: `${type} to ${recipient}`, recipient },
        ...state.transactions
      ]
    };
  }),

  orderCard: (type, name) => set((state) => ({
    cards: [
      ...state.cards,
      { 
        id: `C${state.cards.length + 1}`, 
        name, 
        number: Math.floor(1000 + Math.random() * 9000).toString(), 
        expiry: '12/28', 
        type, 
        status: 'pending', 
        balance: 0 
      }
    ]
  })),

  toggleCardStatus: (cardId) => set((state) => ({
    cards: state.cards.map(c => 
      c.id === cardId 
        ? { ...c, status: c.status === 'active' ? 'frozen' : 'pending' } 
        : c
    )
  })),

  updateUser: (data) => set((state) => {
    if (data.pin !== undefined) {
      localStorage.setItem('user_pin', data.pin);
    }
    const emailKey = (data.email || state.email || '').toLowerCase();
    if (emailKey) {
      if (data.firstName) localStorage.setItem(`user_first_${emailKey}`, data.firstName);
      if (data.lastName) localStorage.setItem(`user_last_${emailKey}`, data.lastName);
      if (data.phone) localStorage.setItem(`user_phone_${emailKey}`, data.phone);
      if (data.dob) localStorage.setItem(`user_dob_${emailKey}`, data.dob);
    }
    return { ...state, ...data };
  }),
  setGraphQLUser: (user) => set((state) => {
    const emailKey = (user.email || '').toLowerCase();
    const storedFirst = emailKey ? localStorage.getItem(`user_first_${emailKey}`) : '';
    const storedLast = emailKey ? localStorage.getItem(`user_last_${emailKey}`) : '';
    const storedPhone = emailKey ? localStorage.getItem(`user_phone_${emailKey}`) : '';
    const storedDob = emailKey ? localStorage.getItem(`user_dob_${emailKey}`) : '';

    const first = user.firstName || storedFirst || state.firstName || (emailKey.includes('henry') ? 'Henry' : 'Henry');
    const last = user.lastName || storedLast || state.lastName || (emailKey.includes('david') ? 'David' : 'David');
    const phone = user.phoneNumber || storedPhone || state.phone || '+1 (555) 019-2834';
    const dob = storedDob || state.dob || '1990-01-01';

    if (emailKey) {
      if (first) localStorage.setItem(`user_first_${emailKey}`, first);
      if (last) localStorage.setItem(`user_last_${emailKey}`, last);
      if (phone) localStorage.setItem(`user_phone_${emailKey}`, phone);
      if (dob) localStorage.setItem(`user_dob_${emailKey}`, dob);
    }

    const profileImage = user.profileImage;
    const sanitizedProfilePic = (profileImage && profileImage !== 'null' && profileImage !== 'undefined' && profileImage.trim() !== '') ? profileImage : null;

    return {
      id: user.id || '',
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`.trim() || 'Henry David',
      email: user.email || '',
      phone: phone,
      username: user.username || '',
      accountNumber: user.accountNumber || '9909219487',
      memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'May 2026',
      currency: user.currencyProtocol || 'USD',
      tier: user.accountTier || 'Member',
      occupation: user.occupation || '',
      country: user.country || '',
      address: user.address || '',
      city: user.city || '',
      state: user.stateProvince || '',
      zip: user.zipPostalCode || '',
      dob: dob,
      ssn: user.ssn || '',
      primaryBalance: user.primaryBalance ?? 0.00,
      tertiaryBalance: user.tertiaryBalance ?? 0.00,
      secondaryBalance: user.secondaryBalance ?? 0.00,
      totalBalance: user.totalBalance != null ? user.totalBalance : ((user.primaryBalance ?? 0.00) + (user.secondaryBalance ?? 0.00) + (user.tertiaryBalance ?? 0.00)),
      balance: user.totalBalance != null ? user.totalBalance : ((user.primaryBalance ?? 0.00) + (user.secondaryBalance ?? 0.00) + (user.tertiaryBalance ?? 0.00)),
      profilePic: sanitizedProfilePic,
      accounts: [
        { id: 'acc1', name: '360 Checking', number: '1424', type: 'Checking', balance: user.primaryBalance ?? 0.00, status: 'Active' },
        { id: 'acc2', name: '360 Checking (Secondary)', number: '6065', type: 'Checking', balance: user.secondaryBalance ?? 0.00, status: 'Active' },
        { id: 'acc3', name: '360 Tertiary Checking', number: '7821', type: 'Savings', balance: user.tertiaryBalance ?? 0.00, status: 'Active' },
        { id: 'acc4', name: 'QUICKSILVER Credit', number: '4432', type: 'Credit', balance: user.totalBalance != null ? user.totalBalance : ((user.primaryBalance ?? 0.00) + (user.secondaryBalance ?? 0.00) + (user.tertiaryBalance ?? 0.00)), status: 'Active' },
      ],
    };
  }),
  updateCardActivation: (cardIdx, data) => set((state) => ({
    cardActivation: {
      ...state.cardActivation,
      [cardIdx]: { ...state.cardActivation[cardIdx], ...data }
    }
  })),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_pin');
    localStorage.removeItem('is_pin_verified');
    set({ 
      isAuthenticated: false, 
      isPinVerified: false,
      id: "",
      balance: 0.00,
      fullName: "Henry David",
      firstName: "Henry",
      lastName: "David",
      email: "",
      phone: "",
      username: "",
      ssn: "",
      accountNumber: "9909219487",
      profilePic: null,
      transactions: [],
      cards: [],
    });
  },
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    return { theme: nextTheme };
  }),
}));
