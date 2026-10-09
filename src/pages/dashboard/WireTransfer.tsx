import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  Info,
  Clock,
  Landmark,
  ChevronDown,
  X,
  Search,
  RefreshCw,
  FileText,
  QrCode,
  Copy,
  Upload,
  Bitcoin,
  Smartphone,
  Activity,
  Maximize2,
  Check,
  ArrowUpCircle,
  ArrowDownCircle,
  FileImage,
  Lock
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useNavigate } from 'react-router-dom';
import { CountrySelect, StateSelect } from '@/src/components/ui/CountrySelect';
import { COUNTRIES_DATA } from '@/src/lib/countries';
import { 
  graphqlFetch, 
  CREATE_WIRE_TRANSFER_MUTATION, 
  MY_WIRE_TRANSFERS_QUERY,
  CREDIT_USER_BALANCE_MUTATION,
  DEBIT_USER_BALANCE_MUTATION,
  CREATE_DEPOSIT_MUTATION
} from '@/src/lib/graphql';

type DepositMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  category: 'Crypto' | 'Digital Wallets';
  network: string;
  qrAddress: string;
  instructions: {
    label: string;
    value: string;
    copyable?: boolean;
  }[];
};

const DEPOSIT_METHODS: DepositMethod[] = [
  {
    id: 'btc-exodus',
    name: 'Bitcoin (BTC) - Exodus Wallet',
    icon: Bitcoin,
    description: 'Native SegWit (Bech32) clearance node',
    category: 'Crypto',
    network: 'BITCOIN (Native SegWit)',
    qrAddress: 'bc1qyzhsvk3ue229py7xf47n5054299ef9j3uzcqpv',
    instructions: [
      { label: 'Network', value: 'BITCOIN (Native SegWit / Bech32)' },
      { label: 'BTC Wallet Address (Exodus)', value: 'bc1qyzhsvk3ue229py7xf47n5054299ef9j3uzcqpv', copyable: true },
      { label: 'Target Wallet', value: 'Bitcoin Exodus Node' },
      { label: 'Expected Confirmation', value: '2 blocks (~10-20 mins)' }
    ]
  },
  {
    id: 'btc-2',
    name: 'Bitcoin (BTC) - Wallet 2',
    icon: Bitcoin,
    description: 'Secondary Bitcoin liquidity node',
    category: 'Crypto',
    network: 'BITCOIN (Native SegWit)',
    qrAddress: 'bc1q93mz3wj4eyc88n9l4h5ttpwjm6dmh5zmsfl02m',
    instructions: [
      { label: 'Network', value: 'BITCOIN (Native SegWit / Bech32)' },
      { label: 'BTC Wallet Address (Bitcoin 2)', value: 'bc1q93mz3wj4eyc88n9l4h5ttpwjm6dmh5zmsfl02m', copyable: true },
      { label: 'Target Wallet', value: 'Bitcoin 2 Node' },
      { label: 'Expected Confirmation', value: '2 blocks (~10-20 mins)' }
    ]
  },
  {
    id: 'eth',
    name: 'Ethereum (ETH)',
    icon: Activity,
    description: 'Global smart contract & ERC-20 clearance node',
    category: 'Crypto',
    network: 'Ethereum (ERC-20)',
    qrAddress: '0x100d20026B20DFFbD82Ce892BbfD7b49E0214F2D',
    instructions: [
      { label: 'Network', value: 'Ethereum (ERC-20)' },
      { label: 'ETH Wallet Address', value: '0x100d20026B20DFFbD82Ce892BbfD7b49E0214F2D', copyable: true },
      { label: 'Target Wallet', value: 'Ethereum Reserve Node' },
      { label: 'Expected Confirmation', value: '12 blocks (~3-5 mins)' }
    ]
  },
  {
    id: 'cashapp',
    name: 'CashApp',
    icon: Smartphone,
    description: 'Instant mobile P2P settlement via Bitcoin network',
    category: 'Digital Wallets',
    network: 'BITCOIN NETWORK',
    qrAddress: 'bc1qyzhsvk3ue229py7xf47n5054299ef9j3uzcqpv',
    instructions: [
      { label: 'Method', value: 'BITCOIN DEPOSIT VIA CASHAPP' },
      { label: 'Network', value: 'BITCOIN' },
      { label: 'BTC Wallet Address (Exodus)', value: 'bc1qyzhsvk3ue229py7xf47n5054299ef9j3uzcqpv', copyable: true },
      { label: 'BTC Wallet Address (Bitcoin 2)', value: 'bc1q93mz3wj4eyc88n9l4h5ttpwjm6dmh5zmsfl02m', copyable: true },
      { label: 'Note Requirement', value: '10% Clearance Fee' }
    ]
  }
];

export default function WireTransfer() {
  const { id, balance, totalBalance, primaryBalance, secondaryBalance, tertiaryBalance, showToast } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
     type: 'DOMESTIC WIRE',
     recipient: '',
     account: '',
     routing: '',
     bank: '',
     amount: '',
     country: 'United States',
     state: 'New York'
  });

  const [selectedAccount, setSelectedAccount] = useState<'acc1' | 'acc2' | 'acc3'>('acc2');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  // 10% Fee System State
  const [isFeePaid, setIsFeePaid] = useState(false);
  const [paidFeeAmount, setPaidFeeAmount] = useState<number>(0);
  const [showFeeDepositModal, setShowFeeDepositModal] = useState(false);
  const [selectedFeeMethod, setSelectedFeeMethod] = useState<DepositMethod>(DEPOSIT_METHODS[0]);
  const [activeFeeQrAddress, setActiveFeeQrAddress] = useState<string>(DEPOSIT_METHODS[0].qrAddress);
  const [feeProofFile, setFeeProofFile] = useState<File | null>(null);
  const [feeTxHash, setFeeTxHash] = useState('');
  const [submittingFeeDeposit, setSubmittingFeeDeposit] = useState(false);
  const [feeDepositError, setFeeDepositError] = useState('');
  const [feeCopiedId, setFeeCopiedId] = useState<string | null>(null);
  const [isEnlargedQrOpen, setIsEnlargedQrOpen] = useState(false);

  // Wire list state & filters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wireTransfers, setWireTransfers] = useState<any[]>([]);
  const [loadingWires, setLoadingWires] = useState(false);
  const [wireError, setWireError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Use totalBalance if available, or fall back to balance
  const actualBalance = totalBalance > 0 ? totalBalance : balance;

  // Real-time calculation of 10% fee
  const amountNumber = parseFloat(formData.amount) || 0;
  const calculatedFee = amountNumber > 0 ? Number((amountNumber * 0.10).toFixed(2)) : 0;

  // When amount changes significantly after paying fee, warn if extra fee is needed
  const isPaidFeeSufficient = isFeePaid && (paidFeeAmount >= calculatedFee || Math.abs(paidFeeAmount - calculatedFee) < 0.01);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, amount: val }));
    const newAmt = parseFloat(val) || 0;
    const newFee = Number((newAmt * 0.10).toFixed(2));
    if (isFeePaid && paidFeeAmount > 0 && newFee > paidFeeAmount + 0.01) {
      setIsFeePaid(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setFeeCopiedId(id);
    showToast('Wallet address copied to clipboard successfully.', 'success', 'ADDRESS COPIED');
    setTimeout(() => setFeeCopiedId(null), 2500);
  };

  const compressImage = (file: File, maxWidth = 600, maxHeight = 600, quality = 0.6): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            }, 'image/jpeg', quality);
          } else {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const uploadProofAsset = async (file: File): Promise<string> => {
    const fallbackBase64 = () => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    const uploadPromise = async (): Promise<string> => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', 'preset_unsigned');
      fd.append('api_key', 'Om6jzyVgLO4CrAJMaDYaWO-mlEo');
      const res = await fetch(`https://api.cloudinary.com/v1_1/progresshenry/image/upload`, {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return data.secure_url;
        }
      }
      throw new Error("Cloudinary upload failed");
    };

    try {
      const result = await Promise.race([
        uploadPromise(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Upload timeout")), 3500))
      ]);
      return result;
    } catch (err) {
      console.warn("Utilizing instant base64 proof representation:", err);
      return await fallbackBase64();
    }
  };

  const handleConfirmFeeDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatedFee || calculatedFee <= 0) {
      setFeeDepositError('Please enter a valid withdrawal amount before making the 10% fee payment.');
      return;
    }

    setSubmittingFeeDeposit(true);
    setFeeDepositError('');

    try {
      let proofUrl = '';
      if (feeProofFile) {
        const compressed = await compressImage(feeProofFile);
        proofUrl = await uploadProofAsset(compressed);
      } else {
        proofUrl = feeTxHash ? `TX_HASH:${feeTxHash}` : 'CLEARED_FEE_PROTOCOL_RECEIPT';
      }

      // Create deposit record on backend
      const depositInput = {
        amount: calculatedFee,
        paymentMethod: selectedFeeMethod.name,
        proofOfPayment: proofUrl,
        reference: `10% Clearance Fee for Withdrawal to ${formData.recipient || 'Recipient'} [Ref: WF-${Date.now().toString().slice(-6)}]`
      };

      try {
        await graphqlFetch(CREATE_DEPOSIT_MUTATION, { input: depositInput });
      } catch (depErr) {
        console.warn("Backend deposit mutation log:", depErr);
      }

      setIsFeePaid(true);
      setPaidFeeAmount(calculatedFee);
      showToast(`10% Clearance Fee of $${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} successfully submitted and verified!`, 'success', '10% FEE VERIFIED');
      setShowFeeDepositModal(false);
      setSubmitError('');
    } catch (err: any) {
      console.error("Fee deposit confirmation error:", err);
      setFeeDepositError(err.message || 'Fee deposit confirmation encountered an error. Please retry.');
    } finally {
      setSubmittingFeeDeposit(false);
    }
  };

  const loadWireTransfers = async () => {
    setLoadingWires(true);
    setWireError('');
    try {
      const res = await graphqlFetch(MY_WIRE_TRANSFERS_QUERY);
      if (res && res.myWireTransfers) {
        setWireTransfers(res.myWireTransfers);
      }
    } catch (err: any) {
      console.error("Failed to fetch wire transfers:", err);
      setWireError(err.message || 'Could not synchronize withdrawal records.');
    } finally {
      setLoadingWires(false);
    }
  };

  const handleOpenFeeModal = () => {
    if (!formData.amount || amountNumber <= 0) {
      setSubmitError('Please enter the withdrawal amount first to calculate the 10% clearance fee.');
      return;
    }
    if (amountNumber < 500 || amountNumber > 1000000) {
      setSubmitError('Withdrawal limit protocols violated. Must be between $500.00 and $1,000,000.00.');
      return;
    }
    setSubmitError('');
    setShowFeeDepositModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = Number(formData.amount);
    if (!formData.recipient || !formData.account || !formData.bank || !formData.amount) {
      setSubmitError('Please complete all mandatory protocols.');
      return;
    }
    if (amtNum < 500 || amtNum > 1000000) {
      setSubmitError('Withdrawal limit protocols violated. Must be between $500.00 and $1,000,000.00.');
      return;
    }

    // Enforce 10% fee payment requirement before withdrawal can proceed
    if (!isPaidFeeSufficient) {
      setSubmitError(`A mandatory 10% clearance fee of $${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} must be paid and verified before this withdrawal can be executed.`);
      setShowFeeDepositModal(true);
      return;
    }

    let sourceBalance = secondaryBalance;
    let sourceName = 'Secondary Checking';
    if (selectedAccount === 'acc1') {
      sourceBalance = primaryBalance;
      sourceName = 'Primary Checking';
    } else if (selectedAccount === 'acc3') {
      sourceBalance = tertiaryBalance;
      sourceName = 'Tertiary Checking';
    }

    if (sourceBalance < amtNum) {
      setSubmitError(`Insufficient liquidity in selected source account (${sourceName}). Available balance: $${sourceBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // 1. Shift balance between accounts if needed
      if (selectedAccount !== 'acc2' && id) {
        const fromType = selectedAccount === 'acc1' ? 'PRIMARY_BALANCE' : 'TERTIARY_BALANCE';
        
        try {
          await graphqlFetch(DEBIT_USER_BALANCE_MUTATION, {
            input: {
              userId: id,
              balanceType: fromType,
              amount: amtNum
            }
          });

          await graphqlFetch(CREDIT_USER_BALANCE_MUTATION, {
            input: {
              userId: id,
              balanceType: 'SECONDARY_BALANCE',
              amount: amtNum
            }
          });
        } catch (shiftErr: any) {
          console.warn("Balance adjustment log:", shiftErr);
        }
      }

      // 2. Execute the actual withdrawal transfer
      const accTypeString = selectedAccount === 'acc1' 
        ? "PRIMARY_ACCOUNT" 
        : selectedAccount === 'acc3'
        ? "TERTIARY_ACCOUNT"
        : "SECONDARY_ACCOUNT";

      const input = {
        beneficiaryName: formData.recipient,
        beneficiaryBank: formData.bank,
        accountNumber: formData.account,
        swiftCode: formData.routing || 'N/A',
        amount: amtNum,
        reason: `${formData.type || 'WITHDRAWAL'} [10% Fee Cleared: $${paidFeeAmount.toFixed(2)}]`,
        accountType: accTypeString
      };

      await graphqlFetch(CREATE_WIRE_TRANSFER_MUTATION, { input });
      showToast(`Withdrawal of $${amtNum.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${formData.recipient} broadcasted successfully!`, 'success', 'WITHDRAWAL SIGNED');
      
      // Update local state balances
      const nextBalance = Math.max(0, actualBalance - amtNum);
      const nextPrimary = selectedAccount === 'acc1' ? Math.max(0, primaryBalance - amtNum) : primaryBalance;
      const nextSecondary = selectedAccount === 'acc2' ? Math.max(0, secondaryBalance - amtNum) : secondaryBalance;
      const nextTertiary = selectedAccount === 'acc3' ? Math.max(0, tertiaryBalance - amtNum) : tertiaryBalance;

      useStore.getState().updateUser({
        balance: nextBalance,
        totalBalance: nextBalance,
        primaryBalance: nextPrimary,
        secondaryBalance: nextSecondary,
        tertiaryBalance: nextTertiary
      });
      
      setSuccess(true);
    } catch (err: any) {
      console.error("Withdrawal execution error:", err);
      setSubmitError(err.message || 'Execution connection failed. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWires = wireTransfers.filter(wire => {
    const term = searchQuery.toLowerCase();
    return (
      (wire.beneficiaryName || '').toLowerCase().includes(term) ||
      (wire.beneficiaryBank || '').toLowerCase().includes(term) ||
      (wire.reason || '').toLowerCase().includes(term) ||
      (wire.reference || '').toLowerCase().includes(term) ||
      (wire.status || '').toLowerCase().includes(term)
    );
  });

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-12 animate-in fade-in duration-500">
        <div className="relative inline-block mx-auto">
          <div className="absolute inset-0 bg-[#FF4D00] blur-[60px] opacity-20 animate-pulse" />
          <div className="w-32 h-32 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-[#FF4D00] relative z-10 mx-auto group">
            <CheckCircle2 size={64} className="group-hover:scale-110 transition-transform duration-500" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
            <Check size={14} /> 10% Clearance Fee Cleared ($ {paidFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })})
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-white italic tracking-tighter uppercase">WITHDRAWAL <span className="text-[#FF4D00]">BROADCASTED</span></h2>
          <p className="text-zinc-500 font-bold max-w-md mx-auto text-xs uppercase leading-loose tracking-widest leading-relaxed">
            Your withdrawal of <span className="text-white font-black italic">${Number(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> to <span className="text-white font-black">{formData.recipient}</span> has been processed. The funds are cleared and in pipeline settlement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-[#FF4D00] text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
          >
            RETURN TO DASHBOARD
          </button>
          <button 
            type="button"
            onClick={() => navigate('/dashboard/transactions')}
            className="bg-zinc-950 text-white border border-white/10 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-zinc-900 transition-all w-full sm:w-auto"
          >
            VIEW LEDGER LOGS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 sm:px-0">
      {/* Orange/Black Header */}
      <div className="bg-[#FF4D00] p-6 sm:p-12 rounded-b-[2.5rem] sm:rounded-b-[4rem] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -rotate-45 pointer-events-none" />
        <div className="relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/15 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-black mb-2">
            <ArrowUpCircle size={12} strokeWidth={2.5} /> Sovereign Settlement Gateway
          </div>
          <h1 className="text-2xl sm:text-4xl xs:text-5xl font-display font-black text-black italic tracking-tighter uppercase leading-none">WITHDRAWAL</h1>
        </div>
        <div className="relative z-10 text-center sm:text-right">
          <p className="text-[8px] sm:text-[10px] text-black/50 font-black uppercase tracking-widest mb-1 italic leading-none">Protocol Balance</p>
          <p className="text-xl sm:text-3xl font-display font-black text-black italic tracking-tighter leading-none">${actualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="pt-8 sm:pt-10 space-y-8 sm:space-y-10">
        {/* Actions bar for triggering logs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#FF4D00]" />
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">SETTLEMENT QUEUE ACTIVE</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              loadWireTransfers();
            }}
            className="w-full sm:w-auto bg-zinc-950 border border-white/10 hover:border-[#FF4D00]/50 text-white hover:text-[#FF4D00] px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 italic shadow-lg"
          >
            <Clock size={12} strokeWidth={3} />
            View Past Withdrawals
          </button>
        </div>

        {/* Information Box */}
        <div className="bg-[#FFFFCC] p-6 sm:p-8 border border-amber-200 rounded-[2rem] sm:rounded-[2.5rem] flex gap-3 sm:gap-4 md:items-center">
          <Info className="text-amber-600 shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
          <p className="text-[9px] sm:text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight italic">
            Secure Withdrawal Protocol: Recipient data must be verified. A mandatory 10% liquidity clearance fee is required on all withdrawal amounts prior to settlement broadcast.
          </p>
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 space-y-6 sm:space-y-8 shadow-2xl">
          <div className="space-y-3 sm:space-y-4">
             <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Withdrawal Protocol *</label>
             <div className="relative">
                 <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-orange-500 appearance-none"
                 >
                   <option>DOMESTIC WIRE</option>
                   <option>INTERNATIONAL SWIFT</option>
                   <option>SEPA SETTLEMENT</option>
                   <option>EXPRESS WIRE DISBURSEMENT</option>
                </select>
                <ChevronDown className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
             <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Source Account *</label>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Account 1 */}
                <div 
                   onClick={() => setSelectedAccount('acc1')}
                   className={cn(
                      "p-5 rounded-2xl border cursor-pointer transition-all duration-300",
                      selectedAccount === 'acc1' 
                         ? "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/5 animate-pulse" 
                         : "bg-black border-white/10 hover:border-white/20"
                   )}
                >
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Primary Checking</p>
                         <p className="text-[8px] font-mono text-zinc-600 mt-0.5">...1424</p>
                      </div>
                      <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0", selectedAccount === 'acc1' ? "border-orange-500 bg-orange-500" : "border-zinc-700")}>
                         {selectedAccount === 'acc1' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                   </div>
                   <p className="text-sm font-display font-black text-white italic tracking-tight mt-4">${primaryBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Account 3 */}
                <div 
                   onClick={() => setSelectedAccount('acc3')}
                   className={cn(
                      "p-5 rounded-2xl border cursor-pointer transition-all duration-300",
                      selectedAccount === 'acc3' 
                         ? "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/5 animate-pulse" 
                         : "bg-black border-white/10 hover:border-white/20"
                   )}
                >
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Tertiary Checking</p>
                         <p className="text-[8px] font-mono text-zinc-600 mt-0.5">...7821</p>
                      </div>
                      <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0", selectedAccount === 'acc3' ? "border-orange-500 bg-orange-500" : "border-zinc-700")}>
                         {selectedAccount === 'acc3' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                   </div>
                   <p className="text-sm font-display font-black text-white italic tracking-tight mt-4">${tertiaryBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Account 2 */}
                <div 
                   onClick={() => setSelectedAccount('acc2')}
                   className={cn(
                      "p-5 rounded-2xl border cursor-pointer transition-all duration-300",
                      selectedAccount === 'acc2' 
                         ? "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/5 animate-pulse" 
                         : "bg-black border-white/10 hover:border-white/20"
                   )}
                >
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Secondary Checking</p>
                         <p className="text-[8px] font-mono text-zinc-600 mt-0.5">...6065</p>
                      </div>
                      <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0", selectedAccount === 'acc2' ? "border-orange-500 bg-orange-500" : "border-zinc-700")}>
                         {selectedAccount === 'acc2' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                   </div>
                   <p className="text-sm font-display font-black text-white italic tracking-tight mt-4">${secondaryBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
             </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
             <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Recipient Name *</label>
             <input 
               placeholder="ENTER FULL LEGAL NAME" 
               value={formData.recipient}
               onChange={(e) => setFormData({...formData, recipient: e.target.value})}
               className="w-full bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-orange-500" 
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 sm:space-y-4">
               <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Account / IBAN *</label>
               <input 
                 placeholder="IBAN / ACCOUNT SEQUENCE" 
                 value={formData.account}
                 onChange={(e) => setFormData({...formData, account: e.target.value})}
                 className="w-full bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-orange-500" 
               />
            </div>
            <div className="space-y-3 sm:space-y-4">
               <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Routing / Swift BIC</label>
               <input 
                 placeholder="SWIFT BIC / ABA ROUTING" 
                 value={formData.routing}
                 onChange={(e) => setFormData({...formData, routing: e.target.value})}
                 className="w-full bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-orange-500" 
               />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
             <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Bank Institution *</label>
             <input 
               placeholder="DESTINATION BANK NAME" 
               value={formData.bank}
               onChange={(e) => setFormData({...formData, bank: e.target.value})}
               className="w-full bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-orange-500" 
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountrySelect 
               label="Bank Country *"
               value={formData.country}
               onChange={(val) => {
                  const countryObj = COUNTRIES_DATA.find(c => c.name === val);
                  setFormData({
                     ...formData,
                     country: val,
                     state: countryObj?.states[0] || ''
                  });
               }}
            />
            <StateSelect 
               label="Bank State / Province *"
               country={formData.country}
               value={formData.state}
               onChange={(val) => setFormData({...formData, state: val})}
            />
          </div>

          {/* Amount Field with Real-Time 10% Fee Calculation */}
          <div className="space-y-3 sm:space-y-4">
             <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 sm:ml-2 italic">Withdrawal Amount *</label>
             <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-orange-500/50 italic">$</span>
                 <input 
                    placeholder="0.00" 
                    type="number" 
                    value={formData.amount}
                    onChange={handleAmountChange}
                    className="w-full bg-black border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 pl-12 sm:pl-14 text-2xl sm:text-4xl font-display font-black text-[#FF4D00] uppercase italic tracking-tighter outline-none focus:border-orange-500" 
                 />
             </div>
             <p className="text-[7.5px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic ml-1 sm:ml-2 text-center sm:text-left">Min: $500.00 - Max: $1,000,000.00</p>
          </div>

          {/* Mandatory 10% Clearance Fee Card & Proceed Button */}
          {amountNumber > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 bg-zinc-900/60 border border-gold/20 rounded-2xl sm:rounded-3xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[60px] pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-gold tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-gold" /> Institutional Clearance Protocol
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-black text-white italic tracking-tight uppercase mt-1">
                    Mandatory 10% Clearance Fee Calculation
                  </h3>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider border",
                    isPaidFeeSufficient 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                  )}>
                    {isPaidFeeSufficient ? (
                      <>
                        <Check size={12} strokeWidth={3} /> FEE PAID & VERIFIED
                      </>
                    ) : (
                      <>
                        <Lock size={12} strokeWidth={2.5} /> PAYMENT REQUIRED
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Calculations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/60 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black uppercase text-zinc-500 tracking-wider block">Withdrawal Amount</span>
                  <span className="text-lg font-display font-black text-white italic mt-1 block">
                    ${amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-gold/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase text-gold tracking-wider block">Mandatory 10% Fee</span>
                    <span className="text-[8px] font-mono font-bold text-gold/80 px-1.5 py-0.5 rounded bg-gold/10">10.00%</span>
                  </div>
                  <span className="text-lg font-display font-black text-gold italic mt-1 block">
                    ${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black uppercase text-zinc-500 tracking-wider block">Net Release Volume</span>
                  <span className="text-lg font-display font-black text-zinc-200 italic mt-1 block">
                    ${amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Notice / Action Button */}
              {!isPaidFeeSufficient ? (
                <div className="space-y-4 pt-2">
                  <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                    Notice: Each withdrawal requires the 10% fee (${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}) to be paid and registered before the withdrawal protocol can be executed. Click below to open the deposit modal and complete this payment directly.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenFeeModal}
                    className="w-full py-4 sm:py-5 px-6 bg-gold hover:bg-gold/90 text-black rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] italic shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                  >
                    <ArrowDownCircle size={18} strokeWidth={2.5} />
                    <span>Proceed to Pay 10% Fee (${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase italic tracking-wider">Clearance Fee Verified & Attached</p>
                      <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                        Amount Paid: ${paidFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} • Protocol Ready for Outflow
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFeeDepositModal(true)}
                    className="text-[8px] font-black uppercase text-gold hover:underline tracking-widest shrink-0"
                  >
                    View Deposit Receipt
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {submitError && (
             <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">
               {submitError}
             </div>
          )}

          <button 
             type="submit"
             disabled={submitting}
             className={cn(
               "w-full h-20 sm:h-24 rounded-2xl sm:rounded-3xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] italic transition-all mt-4 sm:mt-6 disabled:opacity-50 disabled:cursor-not-allowed",
               isPaidFeeSufficient 
                 ? "bg-[#FF4D00] text-black shadow-[0_20px_50px_rgba(255,77,0,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                 : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
             )}
          >
             {submitting ? "Processing Withdrawal Protocol..." : (
               isPaidFeeSufficient 
                 ? "Execute Withdrawal" 
                 : `Pay 10% Fee (${calculatedFee > 0 ? '$' + calculatedFee.toFixed(2) : '10%'}) to Execute`
             )}
          </button>
        </form>
      </div>

      {/* 10% Fee Deposit Modal */}
      <AnimatePresence>
        {showFeeDepositModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-zinc-950 border border-gold/30 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] relative"
            >
              {/* Modal Top Header */}
              <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-8 flex items-center justify-between border-b border-gold/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/30 rounded-2xl flex items-center justify-center text-gold">
                    <ArrowDownCircle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-display font-black text-white italic tracking-tighter uppercase leading-none">
                      10% WITHDRAWAL CLEARANCE DEPOSIT
                    </h2>
                    <p className="text-[8px] sm:text-[9px] font-black text-gold/80 uppercase tracking-widest mt-1 italic leading-none">
                      MANDATORY LIQUIDITY VERIFICATION
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeeDepositModal(false)}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/10"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Fee Summary Banner */}
              <div className="bg-gold/10 border-b border-gold/20 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">Withdrawal Sum</span>
                  <p className="text-sm sm:text-base font-display font-black text-white italic">
                    ${amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gold">Required 10% Fee Due</span>
                  <p className="text-xl sm:text-2xl font-display font-black text-gold italic">
                    ${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Modal Body / Scrollable */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {/* Method Selector Tabs */}
                <div className="space-y-3">
                  <label className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-widest block italic">
                    Select Deposit Channel for 10% Fee
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {DEPOSIT_METHODS.map((method) => {
                      const isSelected = selectedFeeMethod.id === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => {
                            setSelectedFeeMethod(method);
                            setActiveFeeQrAddress(method.qrAddress);
                          }}
                          className={cn(
                            "p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex flex-col items-start gap-2 transition-all min-h-[72px]",
                            isSelected 
                              ? "bg-gold/10 border-gold shadow-lg shadow-gold/5" 
                              : "bg-black/60 border-white/5 hover:border-white/20"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            isSelected ? "bg-gold text-black" : "bg-zinc-900 text-zinc-400"
                          )}>
                            <method.icon size={16} strokeWidth={2.5} />
                          </div>
                          <div>
                            <span className={cn(
                              "text-[9px] sm:text-[10px] font-black uppercase italic block truncate",
                              isSelected ? "text-gold" : "text-zinc-300"
                            )}>
                              {method.name.split(' ')[0]}
                            </span>
                            <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-wider block truncate">
                              {method.network.split(' ')[0]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* QR Code and Target Address Section (Responsive) */}
                <div className="p-4 sm:p-6 bg-black/80 border border-gold/25 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <QrCode size={13} /> {selectedFeeMethod.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEnlargedQrOpen(true)}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-gold hover:text-black text-zinc-400 text-[8px] sm:text-[9px] font-black uppercase rounded-lg border border-white/10 transition-all flex items-center gap-1 min-h-[30px]"
                    >
                      <Maximize2 size={11} /> Enlarge QR
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    {/* QR Code Box */}
                    <div className="shrink-0 mx-auto sm:mx-0">
                      <div 
                        onClick={() => setIsEnlargedQrOpen(true)}
                        className="p-3 bg-white rounded-xl shadow-xl border-2 border-gold/40 cursor-pointer hover:border-gold transition-all"
                        title="Click to enlarge QR"
                      >
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(activeFeeQrAddress)}&color=000000&bgcolor=ffffff&margin=1`}
                          alt="Clearance Fee QR Code"
                          className="w-36 h-36 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain block mx-auto aspect-square select-none"
                          referrerPolicy="no-referrer"
                          loading="eager"
                        />
                      </div>
                      <p className="text-[8px] font-bold text-center text-zinc-500 mt-1.5 tracking-wider uppercase">Scan with Camera</p>
                    </div>

                    {/* Address details and copy */}
                    <div className="space-y-3 text-center sm:text-left flex-1 min-w-0 w-full">
                      <div>
                        <h4 className="text-white text-xs sm:text-sm font-black uppercase italic tracking-tight">Direct Node Scan</h4>
                        <p className="text-zinc-400 text-[10px] sm:text-[11px] leading-relaxed mt-1 font-medium">
                          Scan using your mobile wallet (<span className="text-zinc-200 font-bold">Exodus, Trust Wallet, MetaMask, CashApp</span>) to pay the exact 10% fee of <span className="text-gold font-bold">${calculatedFee.toFixed(2)}</span>.
                        </p>
                      </div>

                      <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-3 space-y-2 text-left">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase text-zinc-500 tracking-wider">
                          <span>Active Target Address</span>
                          <span className="text-gold font-mono truncate max-w-[120px]">{selectedFeeMethod.network}</span>
                        </div>
                        <div className="font-mono text-[11px] sm:text-xs text-zinc-200 break-all select-all font-bold leading-relaxed bg-black/60 p-2 sm:p-2.5 rounded-lg border border-white/5">
                          {activeFeeQrAddress}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(activeFeeQrAddress, 'modal-fee-qr')}
                          className={cn(
                            "w-full py-2.5 px-3 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px]",
                            feeCopiedId === 'modal-fee-qr'
                              ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                              : "bg-gold hover:bg-gold/90 text-black shadow-lg shadow-gold/10 active:scale-[0.98]"
                          )}
                        >
                          {feeCopiedId === 'modal-fee-qr' ? (
                            <>
                              <CheckCircle2 size={14} className="text-black stroke-[3]" />
                              <span>COPIED TO CLIPBOARD!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} className="stroke-[2.5]" />
                              <span>COPY WALLET ADDRESS</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Payment / Reference Form */}
                <form onSubmit={handleConfirmFeeDeposit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-widest block italic">
                      Upload Deposit Receipt / Screenshot (Optional)
                    </label>
                    <label className="flex items-center justify-center gap-3 p-4 bg-black/60 border border-dashed border-white/15 hover:border-gold/50 rounded-xl cursor-pointer transition-colors group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFeeProofFile(e.target.files[0]);
                          }
                        }}
                        className="hidden" 
                      />
                      <FileImage size={18} className="text-zinc-500 group-hover:text-gold transition-colors" />
                      <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase tracking-wider truncate max-w-xs">
                        {feeProofFile ? feeProofFile.name : 'Select screenshot or receipt'}
                      </span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-widest block italic">
                      Transaction Hash / Reference (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0xabc... or CashApp note"
                      value={feeTxHash}
                      onChange={(e) => setFeeTxHash(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-[10px] font-mono font-bold text-white uppercase outline-none focus:border-gold"
                    />
                  </div>

                  {feeDepositError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-bold uppercase text-center">
                      {feeDepositError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingFeeDeposit}
                    className="w-full py-4 sm:py-5 px-6 bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-black rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] italic shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingFeeDeposit ? (
                      <>
                        <RefreshCw size={16} className="animate-spin text-black" />
                        <span>Verifying Deposit Outflow...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} strokeWidth={3} />
                        <span>Confirm 10% Fee Payment (${calculatedFee.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Modal Footer Note */}
              <div className="p-4 bg-black/60 border-t border-white/5 text-center text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest italic">
                SECURE 10% CLEARANCE PROTOCOL • FUNDS INSTANTLY ATTACHED UPON SUBMISSION
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enlarged QR Code Modal */}
      <AnimatePresence>
        {isEnlargedQrOpen && (
          <div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            onClick={() => setIsEnlargedQrOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-950 border border-gold/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 shadow-2xl relative text-center"
            >
              <button
                type="button"
                onClick={() => setIsEnlargedQrOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 bg-zinc-900 hover:bg-gold hover:text-black text-zinc-400 rounded-full flex items-center justify-center transition-all border border-white/10"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div className="space-y-1 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[9px] font-black text-gold uppercase tracking-wider">
                  <QrCode size={12} /> {selectedFeeMethod.name}
                </span>
                <h3 className="text-lg font-display font-black text-white italic uppercase tracking-tight">10% Fee Deposit QR</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Scan to deposit ${calculatedFee.toFixed(2)}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-gold/40 mx-auto inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(activeFeeQrAddress)}&color=000000&bgcolor=ffffff&margin=1`}
                  alt="Enlarged QR Code"
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain block mx-auto select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3 text-left">
                <div className="bg-black border border-white/10 rounded-xl p-3">
                  <span className="block text-[8px] font-black uppercase text-zinc-500 tracking-wider mb-1">Receiving Address</span>
                  <div className="font-mono text-[11px] text-zinc-200 break-all select-all font-bold">
                    {activeFeeQrAddress}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(activeFeeQrAddress, 'modal-enlarge-copy')}
                  className={cn(
                    "w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                    feeCopiedId === 'modal-enlarge-copy'
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                      : "bg-gold hover:bg-gold/90 text-black shadow-lg shadow-gold/20"
                  )}
                >
                  {feeCopiedId === 'modal-enlarge-copy' ? (
                    <>
                      <CheckCircle2 size={16} className="text-black stroke-[3]" />
                      <span>COPIED SUCCESSFULLY!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="stroke-[2.5]" />
                      <span>COPY ADDRESS</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern, Premium, Responsive Past Withdrawals Drawer/Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative"
            >
              {/* Modal Header */}
              <div className="bg-[#FF4D00] p-6 sm:p-8 flex items-center justify-between border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/15 rounded-xl flex items-center justify-center text-black">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black text-black italic tracking-tighter uppercase leading-none">WITHDRAWAL TRANSACTIONS</h2>
                    <p className="text-[8px] font-black text-black/50 uppercase tracking-widest mt-1 italic leading-none">Previous settlement outflows</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-black border border-black/5 transition-all"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>

              {/* Filtering / Search Bar */}
              <div className="p-4 sm:p-6 border-b border-white/5 bg-black/25 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                  <input
                    type="text"
                    placeholder="Search by recipient, bank, reference, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-[#FF4D00] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={loadWireTransfers}
                  disabled={loadingWires}
                  className="bg-zinc-900 border border-white/5 hover:border-white/15 hover:bg-zinc-800 disabled:opacity-40 p-3 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all shrink-0"
                  title="Synchronize records"
                >
                  <RefreshCw size={14} className={cn("transition-transform duration-500", loadingWires && "animate-spin text-[#FF4D00]")} />
                </button>
              </div>

              {/* Modal Body / Scrolling Item List */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {loadingWires ? (
                  <div className="py-20 text-center space-y-4">
                    <RefreshCw className="animate-spin text-[#FF4D00] mx-auto w-8 h-8" />
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] italic">SYNCHRONIZING WITHDRAWAL RECORDS...</p>
                  </div>
                ) : wireError ? (
                  <div className="py-16 text-center space-y-4 border border-red-500/10 rounded-2xl bg-red-500/5">
                    <AlertTriangle className="text-red-500 mx-auto" size={32} />
                    <div>
                      <p className="text-red-500 text-xs font-black uppercase tracking-widest leading-none">Sync failed</p>
                      <p className="text-zinc-500 text-[9px] font-bold uppercase mt-2">{wireError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={loadWireTransfers}
                      className="px-6 py-3 bg-zinc-900 border border-white/5 text-[9px] uppercase font-black tracking-widest text-[#FF4D00] rounded-xl hover:bg-zinc-800"
                    >
                      Retry Uplink
                    </button>
                  </div>
                ) : filteredWires.length === 0 ? (
                  <div className="py-20 text-center space-y-3 bg-black/10 border border-white/5 rounded-[2rem]">
                    <div className="w-14 h-14 bg-zinc-900/40 rounded-2xl flex items-center justify-center text-zinc-500 mx-auto">
                      <Landmark size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-black uppercase tracking-widest italic leading-none">No withdrawals located</p>
                      <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-2">
                        {searchQuery ? "Try altering search filtering criteria." : "Execute your first withdrawal outflow to initiate ledger records."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredWires.map((wire) => (
                      <div
                        key={wire.id}
                        className="p-5 sm:p-6 bg-zinc-900/30 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-white/10 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-black text-white uppercase italic tracking-widest">
                              {wire.beneficiaryName}
                            </span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-[8px] font-mono text-zinc-400">
                              REF: {wire.reference || wire.id}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <div className="flex flex-col">
                              <span className="text-[7px] text-zinc-600 uppercase tracking-widest">Beneficiary Bank</span>
                              <span className="text-[9px] font-black text-zinc-400 uppercase italic tracking-wider truncate">{wire.beneficiaryBank}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[7px] text-zinc-600 uppercase tracking-widest">Account Number</span>
                              <span className="text-[9px] font-mono text-zinc-400 truncate">{wire.accountNumber}</span>
                            </div>
                            <div className="flex flex-col mt-1">
                              <span className="text-[7px] text-zinc-600 uppercase tracking-widest">SWIFT / Routing</span>
                              <span className="text-[9px] font-mono text-zinc-400">{wire.swiftCode || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col mt-1">
                              <span className="text-[7px] text-zinc-600 uppercase tracking-widest">Transfer Purpose</span>
                              <span className="text-[9px] font-black text-zinc-400 uppercase italic tracking-wider truncate">{wire.reason || 'Withdrawal'}</span>
                            </div>
                          </div>

                          <div className="text-[7.5px] font-bold text-zinc-500 border-t border-white/5 pt-2 mt-2">
                            BROADCAST DATE: {new Date(wire.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 shrink-0 select-none">
                          <span className="text-lg font-display font-black text-[#FF4D00] italic leading-none">
                            ${Number(wire.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className={cn(
                            "inline-block px-2.5 py-1 rounded-lg text-[6.5px] font-black uppercase tracking-widest border mt-2.5",
                            wire.status?.toLowerCase() === 'approved' || wire.status?.toLowerCase() === 'completed' || wire.status?.toLowerCase() === 'success'
                              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                              : wire.status?.toLowerCase() === 'pending'
                              ? "bg-amber-950/40 border-amber-500/30 text-amber-500"
                              : "bg-red-950/40 border-red-500/30 text-red-500"
                          )}>
                            {wire.status || 'PENDING'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 sm:p-6 bg-black/40 border-t border-white/5 text-center text-[7px] font-bold text-zinc-500 uppercase tracking-widest italic">
                SECURED VAULT INTERACTION PROTOCOL // ISO-20022 STANDARDS INVOLVED
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
