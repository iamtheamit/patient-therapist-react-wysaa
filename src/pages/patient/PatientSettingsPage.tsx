import React, { useState } from 'react';
import { Bell, Lock, Smartphone, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PatientSettingsPage: React.FC = () => {
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [holdAlerts, setHoldAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
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
            Account Settings
          </h1>
          <p className="text-[#51606f] mt-1 text-xs">
            Manage your notification preferences, account security, and privacy controls.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preferences Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        {/* Notifications Section */}
        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-[#191c1e] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-[#003d9b]" /> Notification Preferences
          </h3>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-[#191c1e] block">SMS Session Reminders</span>
                <span className="text-slate-500">
                  Receive instant text message reminders 2 hours before scheduled therapy visits.
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsReminders}
                onChange={(e) => setSmsReminders(e.target.checked)}
                className="w-4 h-4 accent-[#003d9b] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-[#191c1e] block">
                  Email Statements &amp; Superbills
                </span>
                <span className="text-slate-500">
                  Automatically send billing statements and receipts to your email after each visit.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="w-4 h-4 accent-[#003d9b] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-[#191c1e] block">Slot Hold Expiration Alerts</span>
                <span className="text-slate-500">
                  Get notified when a reserved 10-minute slot hold is about to expire.
                </span>
              </div>
              <input
                type="checkbox"
                checked={holdAlerts}
                onChange={(e) => setHoldAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#003d9b] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-[#191c1e] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-[#003d9b]" /> Security &amp; Authentication
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#003d9b]" />
                <div>
                  <span className="font-bold text-[#191c1e] block">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-slate-500">
                    Require an authenticator app code when signing into your TherapySync account.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 accent-[#003d9b] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-bold text-[#191c1e] block">Password Security</span>
                <span className="text-slate-500">Last changed 30 days ago</span>
              </div>
              <Button variant="outline" size="sm" type="button" className="text-xs font-semibold">
                Change Password
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="bg-[#003d9b] font-semibold text-xs py-2.5 px-6"
          >
            <Save className="w-4 h-4" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientSettingsPage;
