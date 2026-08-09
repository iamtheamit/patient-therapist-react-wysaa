import React, { useState } from 'react';
import { CreditCard, Download, FileText, CheckCircle2, ShieldCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';
import { ComingSoonBanner } from '@/components/common/ComingSoonBanner';

export const PatientPaymentsPage: React.FC = () => {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  return (
    <div className="space-y-8 text-left w-full">
      {/* Feature Coming Soon Banner */}
      <ComingSoonBanner
        featureTitle="Payments & Billing"
        description="Automated claims, HSA/FSA card support, and digital invoicing are under active development."
        onViewSpecs={() => setIsComingSoonOpen(true)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c3c6d6]/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e] flex items-center gap-2">
            Billing &amp; Payments
          </h1>
          <p className="text-[#51606f] mt-1 text-xs">
            Manage your session invoices, insurance claims, and HSA/FSA payment methods.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs font-semibold" disabled>
          <Download className="w-3.5 h-3.5" /> Download Tax Statement (2026)
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#51606f] block">Outstanding Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#191c1e]">$0.00</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Up to date
            </span>
          </div>
          <p className="text-[11px] text-[#737685]">No pending transactions</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#51606f] block">Insurance Reimbursements</span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#51606f]">$0.00</span>
          </div>
          <p className="text-[11px] text-[#737685]">0 Claims Processing</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#51606f] block">Default Payment Card</span>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-sm text-[#51606f]">No Card Added</span>
          </div>
          <p className="text-[11px] text-[#737685]">Add payment method to book slots</p>
        </div>
      </div>

      {/* Main Grid: Left = Invoices Table, Right = Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoices History Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-[#191c1e] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#003d9b]" /> Session Invoices &amp; Superbills
            </h3>
            <span className="text-xs font-semibold text-[#51606f]">0 Total Statements</span>
          </div>

          <div className="py-12 text-center text-[#737685]">
            <p className="text-xs">No invoices or superbills found.</p>
          </div>
        </div>

        {/* Right Sidebar: Payment Methods & Insurance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-[#191c1e]">Saved Payment Cards</h3>
              <button
                className="text-xs text-[#003d9b] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                onClick={() => setIsComingSoonOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="py-8 text-center text-[#737685]">
              <p className="text-xs">No payment cards on file.</p>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2 text-blue-950">
            <div className="flex items-center gap-2 font-bold text-xs text-[#003d9b]">
              <ShieldCheck className="w-4 h-4 text-[#003d9b]" />
              Superbill Insurance Claims
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
              Superbills generated after each session can be submitted directly to out-of-network
              insurance providers for partial or full reimbursement.
            </p>
          </div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureTitle="Payments"
        icon="payments"
      />
    </div>
  );
};

export default PatientPaymentsPage;
