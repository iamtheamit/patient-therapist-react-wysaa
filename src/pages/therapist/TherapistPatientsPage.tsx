import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';
import { ComingSoonBanner } from '@/components/common/ComingSoonBanner';

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number;
  gender: string;
  diagnosis: string;
  riskLevel: 'High' | 'Moderate' | 'Low';
  status: 'Active' | 'Archived';
  totalSessions: number;
  lastSessionDate: string;
  nextSessionDate: string;
  emergencyContact: string;
  medicalHistory: string[];
  recentNotes: string;
}

export const TherapistPatientsPage: React.FC = () => {
  const addToast = useUIStore((state: UIState) => state.addToast);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High' | 'Moderate' | 'Low'>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // New patient state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('');

  const [patients, setPatients] = useState<PatientRecord[]>([]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = riskFilter === 'ALL' || patient.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [patients, searchQuery, riskFilter]);

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientEmail.trim()) return;

    const newRecord: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: newPatientName.trim(),
      email: newPatientEmail.trim(),
      phone: '+1 (555) 000-1122',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      age: 30,
      gender: 'Not Specified',
      diagnosis: newPatientDiagnosis.trim() || 'General Counseling',
      riskLevel: 'Low',
      status: 'Active',
      totalSessions: 0,
      lastSessionDate: 'Never',
      nextSessionDate: 'Pending Schedule',
      emergencyContact: 'Contact Pending',
      medicalHistory: ['Initial intake scheduled'],
      recentNotes: 'Patient file created in portal.',
    };

    setPatients([newRecord, ...patients]);
    setIsAddPatientModalOpen(false);
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientDiagnosis('');
    addToast({
      type: 'success',
      title: 'Patient Added',
      message: `${newRecord.name} was successfully registered.`,
    });
  };

  return (
    <div className="space-y-6 text-left w-full">
      {/* Feature Coming Soon Banner */}
      <ComingSoonBanner
        featureTitle="Patient Directory"
        description="The patient directory and electronic health record module is currently in active development."
        onViewSpecs={() => setIsComingSoonOpen(true)}
      />

      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d6]/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            Patient Directory &amp; EHR
          </h1>
          <p className="text-xs md:text-sm text-[#434654] mt-1">
            Access client health records, clinical progress histories, risk levels, and emergency
            contacts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddPatientModalOpen(true)}
          className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition shadow-2xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Patient
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, diagnosis or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] placeholder:text-[#505f76] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#505f76] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Risk:
          </span>
          {(['ALL', 'High', 'Moderate', 'Low'] as const).map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                riskFilter === risk
                  ? 'bg-[#0052cc] text-white font-bold'
                  : 'bg-[#f8f9fb] text-[#434654] hover:bg-slate-100'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => setSelectedPatient(patient)}
            className="bg-white rounded-2xl p-5 border border-[#c3c6d6]/40 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#c3c6d6]/60"
                  />
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#191c1e] group-hover:text-[#0052cc] transition">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-[#505f76]">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    patient.riskLevel === 'High'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : patient.riskLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {patient.riskLevel} Risk
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#505f76]">
                    Diagnosis
                  </span>
                  <p className="text-xs font-semibold text-[#191c1e] truncate">
                    {patient.diagnosis}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#505f76] pt-1">
                  <span>Sessions Completed:</span>
                  <span className="font-bold text-[#0052cc]">{patient.totalSessions} sessions</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0052cc] font-semibold group-hover:translate-x-0.5 transition">
              <span>View Clinical Record</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Patient Profile EHR Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 shadow-2xl text-left">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#c3c6d6]/40">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatient.avatar}
                  alt={selectedPatient.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0052cc]/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-heading font-bold text-[#191c1e]">
                      {selectedPatient.name}
                    </h2>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        selectedPatient.riskLevel === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : selectedPatient.riskLevel === 'Moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {selectedPatient.riskLevel} Priority
                    </span>
                  </div>
                  <p className="text-xs text-[#505f76] mt-0.5">
                    {selectedPatient.email} • {selectedPatient.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medical Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-[#505f76] mb-1">Primary Diagnosis</p>
                <p className="text-sm font-semibold text-[#191c1e]">{selectedPatient.diagnosis}</p>
              </div>

              <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-[#505f76] mb-1">Emergency Contact</p>
                <p className="text-xs font-semibold text-[#191c1e]">
                  {selectedPatient.emergencyContact}
                </p>
              </div>
            </div>

            {/* Clinical Notes & History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#505f76]">
                Clinical Summary & History
              </h4>
              <ul className="space-y-2 text-xs text-[#191c1e]">
                {selectedPatient.medicalHistory.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0052cc] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5">
              <p className="text-xs font-bold text-[#0052cc]">Latest Session Progress Notes</p>
              <p className="text-xs text-[#434654] leading-relaxed">
                {selectedPatient.recentNotes}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#191c1e] rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-heading font-bold text-[#191c1e]">
                Register New Patient
              </h3>
              <button
                onClick={() => setIsAddPatientModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="eleanor@example.com"
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                  Initial Diagnosis / Specialization Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Panic Disorder, Stress"
                  value={newPatientDiagnosis}
                  onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#191c1e] rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
                >
                  Create Patient File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureTitle="Patient Directory"
        icon="group"
      />
    </div>
  );
};

export default TherapistPatientsPage;
