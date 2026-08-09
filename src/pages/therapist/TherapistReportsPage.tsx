import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  UserCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';
import { ComingSoonBanner } from '@/components/common/ComingSoonBanner';

export const TherapistReportsPage: React.FC = () => {
  const addToast = useUIStore((state: UIState) => state.addToast);
  const [timeframe, setTimeframe] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'YTD'>('THIS_MONTH');
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const handleExportPDF = () => {
    addToast({
      type: 'info',
      title: 'No Data to Export',
      message: 'Practice report generation is empty because there is no clinical data.',
    });
  };

  const handleExportCSV = () => {
    addToast({
      type: 'info',
      title: 'No Data to Export',
      message: 'Raw session metrics csv export is empty.',
    });
  };

  return (
    <div className="space-y-6 text-left w-full">
      {/* Feature Coming Soon Banner */}
      <ComingSoonBanner
        featureTitle="Practice Reports & Analytics"
        description="Comprehensive clinical reports and revenue analytics module are currently in active development."
        onViewSpecs={() => setIsComingSoonOpen(true)}
      />

      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d6]/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            Practice Reports &amp; Analytics
          </h1>
          <p className="text-xs md:text-sm text-[#434654] mt-1">
            Track practice earnings, completed session hours, client attendance rates, and treatment
            outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex bg-[#f8f9fb] p-1 rounded-xl border border-[#c3c6d6]/40 text-xs font-semibold">
            {(
              [
                { id: 'THIS_MONTH', label: 'This Month' },
                { id: 'LAST_MONTH', label: 'Last Month' },
                { id: 'YTD', label: 'Year to Date' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setTimeframe(item.id)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeframe === item.id
                    ? 'bg-white text-[#0052cc] shadow-xs font-bold'
                    : 'text-[#434654] hover:text-[#191c1e]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            PDF Report
          </button>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Monthly Practice Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">$0.00</p>
          <p className="text-[11px] text-[#737685] font-semibold flex items-center gap-1">
            No change vs last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Clinical Session Hours</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">0 Hours</p>
          <p className="text-[11px] text-[#737685] font-semibold">No sessions completed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Attendance / Show Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">0.0%</p>
          <p className="text-[11px] text-[#737685] font-semibold">No sessions scheduled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Patient Retention</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">0%</p>
          <p className="text-[11px] text-[#737685] font-semibold">0 active clients</p>
        </div>
      </div>

      {/* Visual Graphical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Session Volume Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-bold text-[#191c1e]">
                Monthly Session Volume (2026)
              </h3>
              <p className="text-xs text-[#505f76]">Completed therapy sessions per month</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="text-xs font-semibold text-[#505f76] flex items-center gap-1 cursor-not-allowed"
              disabled
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV Data
            </button>
          </div>

          <div className="h-56 flex items-center justify-center border border-dashed border-slate-200 rounded-xl bg-[#f8f9fb]/40">
            <span className="text-xs text-[#737685] font-medium">
              No session data available for this timeframe.
            </span>
          </div>
        </div>

        {/* Therapy Specialization Breakdown Pie Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-base font-heading font-bold text-[#191c1e]">
              Therapy Specializations
            </h3>
            <p className="text-xs text-[#505f76]">Distribution of treatment types</p>
          </div>

          <div className="h-56 flex items-center justify-center border border-dashed border-slate-200 rounded-xl bg-[#f8f9fb]/40">
            <span className="text-xs text-[#737685] font-medium">No specialization metrics.</span>
          </div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureTitle="Reports"
        icon="bar_chart"
      />
    </div>
  );
};

export default TherapistReportsPage;
