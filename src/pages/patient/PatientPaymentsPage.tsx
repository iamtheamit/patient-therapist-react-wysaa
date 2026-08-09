import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';

interface Invoice {
  id: string;
  therapistName: string;
  serviceType: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'INSURANCE_CLAIM';
  superbillUrl?: string;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0801',
    therapistName: 'Dr. Sarah Connor',
    serviceType: '50-Min Cognitive Behavioral Therapy',
    date: 'Aug 04, 2026',
    amount: 150.0,
    status: 'PAID',
  },
  {
    id: 'INV-2026-0728',
    therapistName: 'Dr. Sarah Connor',
    serviceType: '50-Min Intake Assessment',
    date: 'Jul 28, 2026',
    amount: 150.0,
    status: 'PAID',
  },
  {
    id: 'INV-2026-0715',
    therapistName: 'Dr. Marcus Vance',
    serviceType: '50-Min Mindfulness & Mood Session',
    date: 'Jul 15, 2026',
    amount: 150.0,
    status: 'INSURANCE_CLAIM',
  },
];

export const PatientPaymentsPage: React.FC = () => {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  return (
    <div className="space-y-8 text-left w-full">
      {/* Feature Coming Soon Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              Payments &amp; Billing Feature Coming Soon
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 text-amber-800 font-bold uppercase tracking-wider">Preview Mode</span>
            </h3>
            <p className="text-xs text-amber-700/90 mt-0.5">
              Automated claims, HSA/FSA card support, and digital invoicing are under active development.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsComingSoonOpen(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          View Feature Specs
        </button>
      </div>

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

        <Button variant="outline" size="sm" className="text-xs font-semibold">
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
          <p className="text-[11px] text-[#737685]">Next session billing on Aug 12, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#51606f] block">Insurance Reimbursements</span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#003d9b]">$150.00</span>
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 1 Claim Processing
            </span>
          </div>
          <p className="text-[11px] text-[#737685]">Submitted to BlueCross Health</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#51606f] block">Default Payment Card</span>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#003d9b]" />
            <span className="font-bold text-sm text-[#191c1e]">HSA/FSA Visa •••• 4242</span>
          </div>
          <p className="text-[11px] text-[#737685]">Auto-pay active for booked slots</p>
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
            <span className="text-xs font-semibold text-[#51606f]">
              {invoices.length} Total Statements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#51606f] font-bold">
                  <th className="py-3 px-2">Invoice ID</th>
                  <th className="py-3 px-2">Therapist &amp; Service</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-2 font-bold text-[#191c1e]">{inv.id}</td>
                    <td className="py-3.5 px-2">
                      <div className="font-bold text-[#191c1e]">{inv.therapistName}</div>
                      <div className="text-[11px] text-[#737685]">{inv.serviceType}</div>
                    </td>
                    <td className="py-3.5 px-2 text-[#51606f]">{inv.date}</td>
                    <td className="py-3.5 px-2 font-bold text-[#191c1e]">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-2">
                      {inv.status === 'PAID' && (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                          Paid
                        </span>
                      )}
                      {inv.status === 'INSURANCE_CLAIM' && (
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px] border border-amber-200">
                          Claim Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        className="text-[#003d9b] hover:underline font-semibold inline-flex items-center gap-1"
                        title="Download PDF Superbill"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Payment Methods & Insurance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-[#191c1e]">Saved Payment Cards</h3>
              <button className="text-xs text-[#003d9b] font-bold flex items-center gap-1 hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#f8f9ff] border border-[#003d9b]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#003d9b]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#191c1e]">HSA/FSA Card</h4>
                    <p className="text-[11px] text-[#737685]">Expires 12/28 • Default</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Primary
                </span>
              </div>
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
