import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Clock,
  UserCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';

export const TherapistReportsPage: React.FC = () => {
  const addToast = useUIStore((state: UIState) => state.addToast);
  const [timeframe, setTimeframe] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'YTD'>('THIS_MONTH');
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const handleExportPDF = () => {
    addToast({
      type: 'success',
      title: 'Generating PDF Report',
      message: 'Clinical practice performance report PDF is downloading...',
    });
  };

  const handleExportCSV = () => {
    addToast({
      type: 'info',
      title: 'Exporting CSV Data',
      message: 'Raw session metrics exported to CSV.',
    });
  };

  return (
    <div className="space-y-6 text-left w-full">
      {/* Feature Coming Soon Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              Practice Reports &amp; Analytics Feature Coming Soon
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 text-amber-800 font-bold uppercase tracking-wider">Preview Mode</span>
            </h3>
            <p className="text-xs text-amber-700/90 mt-0.5">
              Comprehensive clinical reports and revenue analytics module are currently in active development.
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
          <p className="text-2xl font-heading font-bold text-[#191c1e]">$8,450.00</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Clinical Session Hours</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">68 Hours</p>
          <p className="text-[11px] text-[#0052cc] font-semibold">50 min avg session length</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Attendance / Show Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">95.8%</p>
          <p className="text-[11px] text-purple-600 font-semibold">Only 2 cancellations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#505f76]">Patient Retention</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-[#191c1e]">92%</p>
          <p className="text-[11px] text-amber-600 font-semibold">18 active clients</p>
        </div>
      </div>

      {/* Visual Graphical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Session Volume Bar Chart */}
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
              className="text-xs font-semibold text-[#0052cc] hover:underline flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV Data
            </button>
          </div>

          {/* Bar chart graphics representation */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100">
            {[
              { month: 'Jan', height: '55%', count: 42 },
              { month: 'Feb', height: '65%', count: 50 },
              { month: 'Mar', height: '70%', count: 54 },
              { month: 'Apr', height: '60%', count: 46 },
              { month: 'May', height: '80%', count: 62 },
              { month: 'Jun', height: '88%', count: 68 },
              { month: 'Jul', height: '95%', count: 74 },
              { month: 'Aug', height: '85%', count: 66 },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-[#0052cc] opacity-0 group-hover:opacity-100 transition">
                  {bar.count}
                </span>
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-[#e6f0ff] group-hover:bg-[#0052cc] rounded-t-xl transition-all duration-300"
                />
                <span className="text-xs font-semibold text-[#505f76]">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Therapy Specialization Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#c3c6d6]/40 shadow-xs space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-base font-heading font-bold text-[#191c1e]">
              Therapy Specializations
            </h3>
            <p className="text-xs text-[#505f76]">Distribution of treatment types</p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: 'Cognitive Behavioral (CBT)', percent: '45%', color: 'bg-[#0052cc]' },
              { label: 'Initial Intake Assessments', percent: '25%', color: 'bg-emerald-500' },
              { label: 'PTSD & Trauma Recovery', percent: '18%', color: 'bg-purple-500' },
              { label: 'Stress & Burnout Care', percent: '12%', color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#191c1e]">{item.label}</span>
                  <span className="text-[#505f76]">{item.percent}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.percent }} />
                </div>
              </div>
            ))}
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
