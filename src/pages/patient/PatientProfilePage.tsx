import React, { useState } from 'react';
import { User, Mail, Phone, Heart, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export const PatientProfilePage: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);

  const [fullName, setFullName] = useState(user?.name || 'Alex Patient');
  const [email] = useState(user?.email || 'alex.patient@therapysync.com');
  const [phone, setPhone] = useState('(555) 234-5678');
  const [emergencyContact, setEmergencyContact] = useState(
    'Sarah Miller (Sister) - (555) 987-6543',
  );
  const [primaryGoal, setPrimaryGoal] = useState('Anxiety management & CBT skill building');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-left w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c3c6d6]/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e] flex items-center gap-2">
            Patient Profile
          </h1>
          <p className="text-[#51606f] mt-1 text-xs">
            Manage your personal profile, clinical care goals, and emergency contact information.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile Saved Successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Care Goals (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-base text-[#191c1e] flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-[#003d9b]" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#51606f]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#51606f]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#51606f]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#51606f]">Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-[#51606f]">
                Primary Care &amp; Therapy Goals
              </label>
              <textarea
                rows={3}
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full p-4 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-[#003d9b] font-semibold text-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Health Status & Insurance (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#191c1e] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Assigned Care Team
            </h3>

            <div className="p-3 bg-[#f8f9ff] border border-slate-200 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] font-bold text-[#003d9b] uppercase tracking-wider block">
                Primary Practitioner
              </span>
              <h4 className="font-bold text-[#191c1e]">Dr. Sarah Connor</h4>
              <p className="text-slate-500">Cognitive Behavioral Therapy (CBT)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#191c1e] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#003d9b]" /> Health Insurance
            </h3>

            <div className="space-y-1 text-xs text-[#51606f]">
              <p className="font-bold text-[#191c1e]">BlueCross BlueShield Care</p>
              <p>
                Member ID: <span className="font-semibold text-slate-700">BC-9842104</span>
              </p>
              <p>
                Group No: <span className="font-semibold text-slate-700">GRP-4412</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientProfilePage;
