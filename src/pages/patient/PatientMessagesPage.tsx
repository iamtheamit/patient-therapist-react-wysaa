import React, { useState } from 'react';
import { Send, Lock } from 'lucide-react';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';
import { ComingSoonBanner } from '@/components/common/ComingSoonBanner';

export const PatientMessagesPage: React.FC = () => {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  return (
    <div className="space-y-6 text-left w-full">
      {/* Feature Coming Soon Banner */}
      <ComingSoonBanner
        featureTitle="Messages"
        description="This module is currently under active development. Click below to view feature specifications and early access options."
        onViewSpecs={() => setIsComingSoonOpen(true)}
      />

      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c3c6d6]/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e] flex items-center gap-2">
            Clinical Messages
          </h1>
          <p className="text-[#51606f] mt-1 text-xs">
            End-to-end encrypted messaging with your assigned TherapySync practitioners.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> HIPAA Compliant Encrypted
        </div>
      </div>

      {/* Main Messaging Layout (Empty State) */}
      <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
          <Send className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-lg text-[#191c1e]">No Active Conversations</h3>
        <p className="text-xs text-[#51606f] max-w-sm leading-relaxed">
          Once the messaging feature is active and you have been assigned to a therapist, your
          secure messaging threads will appear here.
        </p>
      </div>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureTitle="Messages"
        icon="chat"
      />
    </div>
  );
};

export default PatientMessagesPage;
