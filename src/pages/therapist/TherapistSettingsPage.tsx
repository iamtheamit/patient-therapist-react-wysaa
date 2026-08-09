import React, { useState } from 'react';
import { User, Video, Bell, ShieldCheck, Save, CheckCircle2, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

export const TherapistSettingsPage: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);
  const addToast = useUIStore((state: UIState) => state.addToast);

  const [activeTab, setActiveTab] = useState<
    'profile' | 'telehealth' | 'notifications' | 'security'
  >('profile');

  // Form states
  const [name, setName] = useState(user?.name || 'Dr. Sarah Connor');
  const [email, setEmail] = useState(user?.email || 'sarah.connor@therapysync.com');
  const [licenseNumber, setLicenseNumber] = useState('PSY-992014-CA');
  const [hourlyRate, setHourlyRate] = useState('150');
  const [bio, setBio] = useState(
    'Licensed Clinical Psychologist specializing in Cognitive Behavioral Therapy (CBT), anxiety disorders, panic relief, and occupational burnout.',
  );
  const [videoLink, setVideoLink] = useState(
    'https://meet.therapysync.example.com/dr-sarah-connor',
  );

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your therapist profile and practice preferences have been updated.',
    });
  };

  return (
    <div className="space-y-6 text-left w-full">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d6]/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            Practice Settings & Profile
          </h1>
          <p className="text-xs md:text-sm text-[#434654] mt-1">
            Manage your public clinical profile, license credentials, telehealth video links, and
            notification settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#c3c6d6]/40 text-xs font-semibold overflow-x-auto">
        {(
          [
            { id: 'profile', label: 'Clinical Profile', icon: User },
            { id: 'telehealth', label: 'Telehealth & Video', icon: Video },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Payouts', icon: ShieldCheck },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#e6f0ff] text-[#0052cc] font-bold shadow-2xs'
                  : 'text-[#434654] hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#c3c6d6]/40 shadow-xs max-w-4xl">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-5 pb-4 border-b border-slate-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
                alt="Profile avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#0052cc]"
              />
              <div>
                <h3 className="text-base font-bold text-[#191c1e]">{name}</h3>
                <p className="text-xs text-[#505f76]">{email}</p>
                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: 'Photo Upload',
                      message: 'Profile picture updated successfully.',
                    })
                  }
                  className="mt-2 text-xs font-semibold text-[#0052cc] hover:underline cursor-pointer"
                >
                  Change Profile Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  License / NPI Number
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  Standard Hourly Rate ($ USD)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                Clinical Biography & Approach
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
              />
            </div>
          </form>
        )}

        {activeTab === 'telehealth' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#191c1e]">Telehealth Video Room Settings</h3>
              <p className="text-xs text-[#505f76] mt-0.5">
                Define the default meeting room link sent to patients upon booking confirmation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  Default Telehealth Video Room URL
                </label>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Built-in TherapySync HD Video:</strong> Video links are encrypted
                  end-to-end and HIPAA compliant.
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#191c1e]">Notification Preferences</h3>
              <p className="text-xs text-[#505f76] mt-0.5">
                Control how and when you receive reminders and booking updates.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-xs font-bold text-[#191c1e]">Email Booking Alerts</h4>
                  <p className="text-[11px] text-[#505f76]">
                    Receive email notifications when a new patient books a session.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#0052cc] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="text-xs font-bold text-[#191c1e]">SMS Session Reminders</h4>
                  <p className="text-[11px] text-[#505f76]">
                    Receive text message reminders 15 minutes before appointments.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#0052cc] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="text-xs font-bold text-[#191c1e]">Daily Morning Agenda Digest</h4>
                  <p className="text-[11px] text-[#505f76]">
                    Receive a summary of today's schedule at 8:00 AM every morning.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="w-4 h-4 text-[#0052cc] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#191c1e]">
                Account Security & Stripe Payouts
              </h3>
              <p className="text-xs text-[#505f76] mt-0.5">
                Manage login credentials, multi-factor authentication, and connected bank account.
              </p>
            </div>

            <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#0052cc]" />
                <div>
                  <h4 className="text-xs font-bold text-[#191c1e]">Connected Stripe Account</h4>
                  <p className="text-[11px] text-[#505f76]">
                    Payouts deposited weekly to Chase ****9821
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                Active & Verified
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Password Reset',
                    message: 'Password reset link sent to your email.',
                  })
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#191c1e] rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistSettingsPage;
