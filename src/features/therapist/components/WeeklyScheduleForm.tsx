import React, { useState } from 'react';
import { Save, Clock, ShieldCheck } from 'lucide-react';
import type { TherapistScheduleConfig, DayScheduleRule } from '../types/therapist.types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useUpdateScheduleConfig } from '../hooks/useTherapistSchedule';
import { cn } from '@/utils/cn';

interface WeeklyScheduleFormProps {
  initialConfig?: TherapistScheduleConfig;
  therapistId: string;
}

export const WeeklyScheduleForm: React.FC<WeeklyScheduleFormProps> = ({
  initialConfig,
  therapistId,
}) => {
  const [config, setConfig] = useState<TherapistScheduleConfig>(
    initialConfig || {
      therapistId,
      slotDurationMinutes: 50,
      bufferDurationMinutes: 10,
      weeklyRules: [
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
      ],
    },
  );

  const { mutate: updateConfig, isPending } = useUpdateScheduleConfig(therapistId);

  const handleRuleToggle = (index: number) => {
    const updatedRules = [...config.weeklyRules];
    updatedRules[index] = {
      ...updatedRules[index],
      isEnabled: !updatedRules[index].isEnabled,
    };
    setConfig({ ...config, weeklyRules: updatedRules });
  };

  const handleTimeChange = (index: number, field: keyof DayScheduleRule, value: string) => {
    const updatedRules = [...config.weeklyRules];
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Session Duration Settings */}
      <Card className="bg-slate-900/90 border-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            <span>Session Duration & Buffer Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label
                htmlFor="slotDurationSelect"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Therapy Session Length
              </label>
              <select
                id="slotDurationSelect"
                value={config.slotDurationMinutes}
                onChange={(e) =>
                  setConfig({ ...config, slotDurationMinutes: Number(e.target.value) })
                }
                className="w-full bg-slate-950 text-white text-xs rounded-xl border border-slate-800 p-3 outline-none focus:border-teal-500 transition"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={50}>50 Minutes (Standard CBT)</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="bufferDurationSelect"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Inter-Session Buffer Break
              </label>
              <select
                id="bufferDurationSelect"
                value={config.bufferDurationMinutes}
                onChange={(e) =>
                  setConfig({ ...config, bufferDurationMinutes: Number(e.target.value) })
                }
                className="w-full bg-slate-950 text-white text-xs rounded-xl border border-slate-800 p-3 outline-none focus:border-teal-500 transition"
              >
                <option value={0}>0 Minutes (Back-to-Back)</option>
                <option value={10}>10 Minutes (Recommended)</option>
                <option value={15}>15 Minutes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Shift Rules Table */}
      <Card className="bg-slate-900/90 border-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Weekly Shift Rules</span>
            </h3>
            <span className="text-xs text-slate-400">Configure daily working hours</span>
          </div>

          <div className="space-y-3 pt-2">
            {config.weeklyRules.map((rule, index) => (
              <div
                key={rule.day}
                className={cn(
                  'p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4',
                  rule.isEnabled
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-slate-950/30 border-slate-900 opacity-60',
                )}
              >
                <div className="flex items-center space-x-3 w-40">
                  <input
                    type="checkbox"
                    id={`check-${rule.day}`}
                    checked={rule.isEnabled}
                    onChange={() => handleRuleToggle(index)}
                    className="w-4 h-4 accent-teal-500 rounded border-slate-700 cursor-pointer"
                  />
                  <label
                    htmlFor={`check-${rule.day}`}
                    className="text-xs font-bold text-white cursor-pointer select-none"
                  >
                    {rule.day}
                  </label>
                </div>

                {rule.isEnabled ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400 font-medium">Shift:</span>
                      <input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 outline-none focus:border-teal-500"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="flex items-center space-x-1.5 md:border-l md:border-slate-800 md:pl-3">
                      <span className="text-slate-400 font-medium">Break:</span>
                      <input
                        type="time"
                        value={rule.breakStartTime || '12:00'}
                        onChange={(e) => handleTimeChange(index, 'breakStartTime', e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 outline-none focus:border-teal-500"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={rule.breakEndTime || '13:00'}
                        onChange={(e) => handleTimeChange(index, 'breakEndTime', e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">
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
          className="bg-teal-600 hover:bg-teal-500 border-teal-500/30"
          isLoading={isPending}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Schedule Configuration
        </Button>
      </div>
    </form>
  );
};
