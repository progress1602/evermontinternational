import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut,
  Camera,
  Edit,
  Info,
  Save,
  Lock,
  Phone,
  Briefcase,
  Globe,
  MapPin,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { COUNTRIES_DATA } from '@/src/lib/countries';
import { CountrySelect, StateSelect } from '@/src/components/ui/CountrySelect';
import { graphqlFetch, UPDATE_PROFILE_MUTATION } from '@/src/lib/graphql';

export default function Profile() {
  const { 
    fullName, firstName, lastName, email, phone, occupation, country, 
    address, city, state, zip, dob, profilePic, pin, currency, accountType,
    username, ssn, logout, updateUser 
  } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    phone: phone || '',
    occupation: occupation || '',
    country: country || 'United States',
    password: '••••••••',
    address: address || '',
    city: city || '',
    state: state || '',
    zip: zip || '',
    dob: dob || '',
    pin: pin || '',
    currency: currency || 'USD',
    accountType: accountType || 'Savings/Checking',
    username: username || '',
    ssn: ssn || ''
  });

  const handleCountryChange = (countryName: string) => {
    const countryObj = COUNTRIES_DATA.find(c => c.name === countryName);
    if (countryObj) {
      setFormData({
        ...formData,
        country: countryName,
        currency: countryObj.currency,
        state: countryObj.states[0] || ''
      });
    }
  };

  // Sync with store if it changes externally
  useEffect(() => {
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      occupation: occupation || '',
      country: country || 'United States',
      password: '••••••••',
      address: address || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
      dob: dob || '',
      pin: pin || '',
      currency: currency || 'USD',
      accountType: accountType || 'Savings/Checking',
      username: username || '',
      ssn: ssn || ''
    });
  }, [firstName, lastName, email, phone, occupation, country, address, city, state, zip, dob, pin, currency, accountType, username, ssn]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [saveError, setSaveError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveError('');
    try {
      const data = await graphqlFetch(UPDATE_PROFILE_MUTATION, {
        input: {
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          userName: formData.username || '',
          phoneNumber: formData.phone || '',
          occupation: formData.occupation || '',
          address: formData.address || '',
          country: formData.country || 'United States',
          stateProvince: formData.state || '',
          city: formData.city || '',
          zipPostalCode: formData.zip || '',
          profileImage: profilePic || null,
          currencyProtocol: formData.currency || 'USD',
          dateOfBirth: formData.dob || '1990-01-01'
        }
      });

      if (data && data.updateProfile) {
        const user = data.updateProfile;
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: user.email || formData.email,
          phone: formData.phone,
          occupation: user.occupation || formData.occupation,
          country: user.country || formData.country,
          address: user.address || formData.address,
          city: user.city || formData.city,
          state: user.stateProvince || formData.state,
          zip: user.zipPostalCode || formData.zip,
          profilePic: user.profileImage || profilePic,
          username: user.username || formData.username,
          currency: user.currencyProtocol || formData.currency,
          dob: formData.dob
        });
        setSaveStatus('success');
        setIsEditing(false);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveError("System failed to update profile parameters.");
        setSaveStatus('idle');
      }
    } catch (err: any) {
      setSaveError(err.message || "UPLINK CONNECTION INTERAction CANCELLED.");
      setSaveStatus('idle');
    }
  };

  const inputClasses = "w-full bg-black border border-white/5 rounded-2xl p-4 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em] ml-2 mb-2 block italic";

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-16 px-4 sm:px-8 space-y-12 pb-32 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
           <h1 className="text-4xl lg:text-7xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            SOVEREIGN <span className="text-gold">ID</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[9px] italic">
            Authorized Identity Node Configuration • v4.2L
          </p>
        </div>
        
        <div className="flex gap-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-zinc-950 border border-gold/20 text-gold rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-gold hover:text-black transition-all shadow-2xl flex items-center gap-2"
            >
              <Edit size={16} strokeWidth={3} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
               <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-4 bg-zinc-900 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-2xl flex items-center gap-2 disabled:opacity-50"
              >
                {saveStatus === 'saving' ? 'Saving...' : <><Save size={16} strokeWidth={3} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
        {/* Left Col: Avatar & Status */}
        <div className="space-y-8">
           <div className="bg-zinc-950 border border-white/5 rounded-[3rem] sm:rounded-[4rem] p-6 sm:p-10 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-gold/5 pointer-events-none">
                <User size={120} />
              </div>
              
              <div className="relative group mx-auto">
                 <div className="absolute inset-0 bg-gold blur-[60px] opacity-10" />
                 <div className="w-40 h-40 sm:w-48 sm:h-48 bg-black border-4 border-white/10 rounded-[2.5rem] sm:rounded-[3.5rem] flex items-center justify-center text-zinc-900 relative z-10 overflow-hidden transition-all duration-700">
                   {profilePic ? (
                     <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User size={80} strokeWidth={1} />
                   )}
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2"
                   >
                      <Camera size={28} className="text-gold" />
                      <span className="text-[7px] font-black uppercase tracking-widest text-white">Update Photo</span>
                   </div>
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*" 
                   onChange={handleImageUpload}
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute -bottom-1 -right-1 w-12 h-12 sm:w-14 sm:h-14 bg-gold text-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border-[3px] sm:border-4 border-black z-20 hover:scale-110 transition-transform"
                 >
                   <Camera size={24} />
                 </button>
              </div>

              <div className="space-y-3 relative z-10">
                <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">{fullName || 'HENRY DAVID'}</h2>
                <div className="flex items-center justify-center gap-2">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Active Sovereign Node</p>
                </div>
              </div>

              <div className="w-full pt-6 border-t border-white/5 space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest italic">
                    <span className="text-zinc-700">Node Status</span>
                    <span className="text-emerald-500">Encrypted</span>
                 </div>
                 <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest italic">
                    <span className="text-zinc-700">Security Clearance</span>
                    <span className="text-gold">Level 4</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#FFFFCC] p-8 border border-amber-200 rounded-[3rem] space-y-4 shadow-xl">
              <div className="flex items-center gap-4 text-amber-600">
                 <Info size={24} strokeWidth={2.5} />
                 <h4 className="text-[11px] font-black uppercase tracking-widest italic leading-none">Security Note</h4>
              </div>
              <p className="text-[10px] font-bold text-amber-900/80 leading-relaxed uppercase tracking-tight italic">
                 Identity modifications require a protocol restat. some changes may trigger a manual node audit.
              </p>
           </div>
        </div>

        {/* Right Col: Forms */}
        <div className="bg-zinc-950 border border-white/5 rounded-[4rem] p-8 lg:p-14 shadow-2xl space-y-12">
           {saveError && (
              <div id="settings-error" className="p-5 bg-red-950/25 border border-red-500/20 rounded-3xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic animate-pulse">
                 [ SOVEREIGN REJECTION ]: {saveError}
              </div>
           )}
           <AnimatePresence mode="wait">
             {saveStatus === 'success' && (
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-3xl flex items-center gap-6"
               >
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                     <CheckCircle2 size={24} strokeWidth={3} />
                  </div>
                  <div>
                     <p className="text-[11px] font-black text-white uppercase tracking-widest italic leading-none">Protocol Updated</p>
                     <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight italic mt-1">Global node configuration synchronized successfully.</p>
                  </div>
                  <button onClick={() => setSaveStatus('idle')} className="ml-auto text-zinc-700 hover:text-white transition-colors">
                     <X size={18} />
                  </button>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Identity Section */}
           <div className="space-y-8">
              <div className="flex items-center gap-6">
                 <div className="h-px bg-gold/10 flex-1" />
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Core Identity</span>
                 <div className="h-px bg-gold/10 flex-1" />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses}>First Name</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Last Name</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Sovereign Email</label>
                  <div className="relative group">
                     <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800" />
                     <input 
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={inputClasses} 
                     />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Phone Protocol</label>
                  <div className="relative group">
                     <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800" />
                     <input 
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className={inputClasses} 
                     />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Username</label>
                  <div className="relative group">
                     <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800" />
                     <input 
                        disabled={!isEditing}
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        className={inputClasses} 
                     />
                  </div>
                </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-center gap-6">
                 <div className="h-px bg-gold/10 flex-1" />
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Fiscal Location</span>
                 <div className="h-px bg-gold/10 flex-1" />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="col-span-full space-y-2">
                  <label className={labelClasses}>Primary Address</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <CountrySelect 
                  label="Country"
                  disabled={!isEditing}
                  value={formData.country}
                  onChange={handleCountryChange}
                />
                <StateSelect 
                  label="State / Province"
                  disabled={!isEditing}
                  country={formData.country}
                  value={formData.state}
                  onChange={val => setFormData({...formData, state: val})}
                />
                <div className="space-y-2">
                  <label className={labelClasses}>City</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>ZIP / Postal Code</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.zip}
                    onChange={e => setFormData({...formData, zip: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className={labelClasses}>Occupation</label>
                  <input 
                    disabled={!isEditing}
                    value={formData.occupation}
                    onChange={e => setFormData({...formData, occupation: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className={labelClasses}>Social Security Number (SSN)</label>
                  <input 
                    disabled={true}
                    value={formData.ssn || 'NOT SPECIFIED'}
                    className={cn(inputClasses, "opacity-70 bg-zinc-950/40 select-all cursor-not-allowed")} 
                  />
                </div>
              </div>
           </div>

           {/* Secure Area Section */}
           <div className="space-y-8">
              <div className="flex items-center gap-6">
                 <div className="h-px bg-red-900/20 flex-1" />
                 <span className="text-[9px] font-black text-red-900 uppercase tracking-[0.5em] italic">Secure Credentials</span>
                 <div className="h-px bg-red-900/20 flex-1" />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses}>Access Password</label>
                  <div className="relative group">
                     <button 
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800 hover:text-gold transition-colors"
                     >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                     <input 
                        type={showPassword ? "text" : "password"}
                        disabled={!isEditing}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className={inputClasses} 
                     />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className={labelClasses}>Date of Birth</label>
                   <input 
                      type="date"
                      disabled={!isEditing}
                      value={formData.dob}
                      onChange={e => setFormData({...formData, dob: e.target.value})}
                      className={inputClasses} 
                   />
                </div>
              </div>
           </div>

           {/* Interface Preferences */}
           <div className="space-y-8 pt-6">
              <div className="flex items-center gap-6">
                 <div className="h-px bg-gold/10 flex-1" />
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Interface Preferences</span>
                 <div className="h-px bg-gold/10 flex-1" />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 bg-black border border-white/5 rounded-[2rem] flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-600 transition-colors">
                         <Globe size={18} />
                      </div>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none">Global Currency</span>
                   </div>
                   <select 
                     disabled={!isEditing}
                     value={formData.currency}
                     onChange={e => setFormData({...formData, currency: e.target.value})}
                     className="bg-transparent border-none text-gold text-[10px] font-black outline-none uppercase italic disabled:opacity-50"
                   >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                   </select>
                </div>

                <div className="p-6 bg-black border border-white/5 rounded-[2rem] flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-600 transition-colors">
                         <ShieldCheck size={18} />
                      </div>
                      <span className="text-[9px] font-black text-white hover:text-gold uppercase tracking-widest italic leading-none">Account Tier</span>
                   </div>
                   <select 
                     disabled={!isEditing}
                     value={formData.accountType}
                     onChange={e => setFormData({...formData, accountType: e.target.value})}
                     className="bg-transparent border-none text-gold text-[10px] font-black outline-none uppercase italic disabled:opacity-50"
                   >
                      <option value="Savings/Checking">PREMIUM</option>
                      <option value="Private Banking">SOVEREIGN</option>
                      <option value="Corporate">CORPORATE</option>
                   </select>
                </div>
              </div>
           </div>

           {/* PIN Management */}
           <div className="space-y-8 pt-6">
              <div className="flex items-center gap-6">
                 <div className="h-px bg-gold/10 flex-1" />
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Access PIN Protocol</span>
                 <div className="h-px bg-gold/10 flex-1" />
              </div>

              <div className="space-y-4 max-w-xs mx-auto">
                <label className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em] mb-2 block italic text-center">4-DIGIT SECURITY PIN</label>
                <div className="relative group/pin">
                  <input 
                    type={showPin ? "text" : "password"}
                    maxLength={4}
                    disabled={!isEditing}
                    value={formData.pin}
                    onChange={e => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                    className={cn(inputClasses, "text-center tracking-[1.5em] text-xl pr-14")} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-700 hover:text-gold transition-colors"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
           </div>

           <button 
             onClick={logout}
             className="w-full h-20 bg-red-600/5 hover:bg-red-600/10 border border-red-600/10 rounded-[2.5rem] text-red-600 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] italic transition-all group shadow-2xl mt-12 mb-6"
           >
             <LogOut size={20} className="group-hover:-translate-x-2 transition-transform" /> Terminate Node Session
           </button>
        </div>
      </div>
    </div>
  );
}
