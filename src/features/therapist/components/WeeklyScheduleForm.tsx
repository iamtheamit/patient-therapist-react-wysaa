import React, { useState } from 'react';
import { Save, Clock, ShieldCheck } from 'lucide-react';
import type { TherapistScheduleConfig, DayScheduleRule } from '../types/therapist.types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useUpdateScheduleConfig } from '../hooks/useTherapistSchedule';
import { cn } from '@/utils/cn';

interface WeeklyScheduleFormProps {
  initialConfig?: TherapistScheduleConfig;
  therapistId: string;
}

const DEFAULT_WEEKLY_RULES: DayScheduleRule[] = [
  {
    day: 'Monday',
    isEnabled: true,
    startTime: '09:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  {
    day: 'Tuesday',
    isEnabled: true,
    startTime: '09:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  {
    day: 'Wednesday',
    isEnabled: true,
    startTime: '09:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  {
    day: 'Thursday',
    isEnabled: true,
    startTime: '09:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  {
    day: 'Friday',
    isEnabled: true,
    startTime: '09:00',
    endTime: '16:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  { day: 'Saturday', isEnabled: false, startTime: '10:00', endTime: '14:00' },
  { day: 'Sunday', isEnabled: false, startTime: '10:00', endTime: '14:00' },
];

export const WeeklyScheduleForm: React.FC<WeeklyScheduleFormProps> = ({
  initialConfig,
  therapistId,
}) => {
  const [config, setConfig] = useState<TherapistScheduleConfig>(() => ({
    therapistId,
    slotDurationMinutes: initialConfig?.slotDurationMinutes ?? 50,
    bufferDurationMinutes: initialConfig?.bufferDurationMinutes ?? 10,
    weeklyRules:
      initialConfig?.weeklyRules && initialConfig.weeklyRules.length > 0
        ? initialConfig.weeklyRules
        : DEFAULT_WEEKLY_RULES,
  }));

  const { mutate: updateConfig, isPending } = useUpdateScheduleConfig(therapistId);

  const handleRuleToggle = (index: number) => {
    const currentRules = config.weeklyRules || DEFAULT_WEEKLY_RULES;
    const updatedRules = [...currentRules];
    updatedRules[index] = {
      ...updatedRules[index],
      isEnabled: !updatedRules[index].isEnabled,
    };
    setConfig({ ...config, weeklyRules: updatedRules });
  };

  const handleTimeChange = (index: number, field: keyof DayScheduleRule, value: string) => {
    const currentRules = config.weeklyRules || DEFAULT_WEEKLY_RULES;
    const updatedRules = [...currentRules];
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value,
    };
    setConfig({ ...config, weeklyRules: updatedRules });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(config);
  };

  const slotDurationStr = (config.slotDurationMinutes ?? 50).toString();
  const bufferDurationStr = (config.bufferDurationMinutes ?? 10).toString();
  const weeklyRulesList = config.weeklyRules || DEFAULT_WEEKLY_RULES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Session Duration Settings */}
      <Card className="bg-white border-[#c3c6d6]/40 shadow-xs rounded-2xl !overflow-visible relative z-30">
        <CardContent className="p-4 sm:p-6 space-y-4 !overflow-visible">
          <div className="flex items-center space-x-2 text-[#0052cc] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Session Duration & Buffer Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 relative z-30">
            <CustomSelect
              label="Therapy Session Length"
              value={slotDurationStr}
              onChange={(val) => setConfig({ ...config, slotDurationMinutes: Number(val) })}
              options={[
                { value: '30', label: '30 Minutes' },
                { value: '45', label: '45 Minutes' },
                { value: '50', label: '50 Minutes (Standard CBT)' },
                { value: '60', label: '60 Minutes' },
              ]}
            />

            <CustomSelect
              label="Inter-Session Buffer Break"
              value={bufferDurationStr}
              onChange={(val) => setConfig({ ...config, bufferDurationMinutes: Number(val) })}
              options={[
                { value: '0', label: '0 Minutes (Back-to-Back)' },
                { value: '10', label: '10 Minutes (Recommended)' },
                { value: '15', label: '15 Minutes' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Shift Rules Table */}
      <Card className="bg-white border-[#c3c6d6]/40 shadow-xs rounded-2xl relative z-10">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <h3 className="text-sm font-heading font-bold text-[#191c1e] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0052cc]" />
              <span>Weekly Shift Rules</span>
            </h3>
            <span className="text-xs text-[#505f76] font-medium">
              Configure daily working hours
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {weeklyRulesList.map((rule, index) => (
              <div
                key={rule.day}
                className={cn(
                  'p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4',
                  rule.isEnabled
                    ? 'bg-[#f8f9fb] border-[#c3c6d6]/40'
                    : 'bg-slate-100/50 border-slate-200 opacity-60',
                )}
              >
                <div className="flex items-center space-x-3 min-w-[120px]">
                  <input
                    type="checkbox"
                    id={`check-${rule.day}`}
                    checked={rule.isEnabled}
                    onChange={() => handleRuleToggle(index)}
                    className="w-4 h-4 accent-[#0052cc] rounded border-slate-300 cursor-pointer"
                  />
                  <label
                    htmlFor={`check-${rule.day}`}
                    className="text-xs font-bold text-[#191c1e] cursor-pointer select-none"
                  >
                    {rule.day}
                  </label>
                </div>

                {rule.isEnabled ? (
                  <div className="flex flex-col xl:flex-row gap-2.5 sm:gap-3 text-xs text-[#191c1e] w-full">
                    {/* Shift Time Window */}
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <span className="text-[#505f76] font-medium w-8 sm:w-10 shrink-0 text-[11px] sm:text-xs">
                        Shift:
                      </span>
                      <input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                        className="bg-white border border-[#c3c6d6]/60 text-[#191c1e] font-semibold rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 shrink-0 w-[102px] sm:w-auto"
                      />
                      <span className="text-[#505f76] px-0.5 shrink-0 text-[11px] sm:text-xs">
                        to
                      </span>
                      <input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                        className="bg-white border border-[#c3c6d6]/60 text-[#191c1e] font-semibold rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 shrink-0 w-[102px] sm:w-auto"
                      />
                    </div>

                    {/* Break Time Window */}
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 xl:border-l xl:border-[#c3c6d6]/40 xl:pl-3">
                      <span className="text-[#505f76] font-medium w-8 sm:w-10 shrink-0 text-[11px] sm:text-xs">
                        Break:
                      </span>
                      <input
                        type="time"
                        value={rule.breakStartTime || '12:00'}
                        onChange={(e) => handleTimeChange(index, 'breakStartTime', e.target.value)}
                        className="bg-white border border-[#c3c6d6]/60 text-[#191c1e] font-semibold rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 shrink-0 w-[102px] sm:w-auto"
                      />
                      <span className="text-[#505f76] px-0.5 shrink-0 text-[11px] sm:text-xs">
                        to
                      </span>
                      <input
                        type="time"
                        value={rule.breakEndTime || '13:00'}
                        onChange={(e) => handleTimeChange(index, 'breakEndTime', e.target.value)}
                        className="bg-white border border-[#c3c6d6]/60 text-[#191c1e] font-semibold rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 shrink-0 w-[102px] sm:w-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[#505f76] italic">
                    Off Day — No slots generated
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="bg-[#0052cc] hover:bg-[#003d9b] text-white shadow-xs rounded-xl font-bold cursor-pointer"
          isLoading={isPending}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Schedule Configuration
        </Button>
      </div>
    </form>
  );
};
