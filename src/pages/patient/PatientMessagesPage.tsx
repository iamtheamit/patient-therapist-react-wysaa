import React, { useState } from 'react';
import { Search, Send, Paperclip, ShieldCheck, Clock, CheckCheck, Lock } from 'lucide-react';

interface ChatThread {
  id: string;
  therapistName: string;
  specialty: string;
  avatarUrl: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
}

const MOCK_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    therapistName: 'Dr. Sarah Connor',
    specialty: 'Cognitive Behavioral Therapy',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTf1ffvDkCcFUrkgufSLU5b5rl5E0xYYSfZ1ssnFH-TctvnOzXWey_6Qe-Jd0Ck0b-TsXxVTNdCdKqehwfBNnpFxLAC2kV-n-dDwfE-qpzhT52oWqYgoHZ3Il6FYHeKtIj4tO2VotciFst6JlxEgBpJW6y8iAjgR88DEy4PsgRctla5fSXqPlmJ6I0vwJyDBAh9b-QxBdI49Y3kt96Tg_DyJ4j_4QZuJ8M0LDAxnKZmF1BbLT63qCe',
    isOnline: true,
    unreadCount: 2,
    lastMessage:
      'Great work on your daily mindfulness journal! Let us review item #3 in our session.',
    lastTime: '10:42 AM',
  },
  {
    id: 'thread-2',
    therapistName: 'Dr. Marcus Vance',
    specialty: 'Mindfulness & Mood Care',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqZmuUQmcTVzJTMOdgIeA6noCDs1eRLKlJaPfthz5mrVwLWqmpQX2h-Doj7HkphDsRhTwWR388HV8Hrrz9suhMoYYMDkWXLiAgbTYOL0hELQT9g5a_EJfzin8N9hNg8CVb1HR30zxjKcwjQAh0h9ts8RZRI0TqzbeAW8kIeGapeVzZt8r9M2NCNPrC_Z0bYcHB7K4DxyFUO9DCA4_lQIjEWxDwQFQHMd00m7bm8aa1f3eNhpVD9AMA',
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'Your upcoming session for Friday at 2:00 PM is confirmed.',
    lastTime: 'Yesterday',
  },
];

interface MessageItem {
  id: string;
  sender: 'therapist' | 'patient';
  text: string;
  timestamp: string;
  attachmentName?: string;
}

const MOCK_MESSAGES: Record<string, MessageItem[]> = {
  'thread-1': [
    {
      id: 'm1',
      sender: 'therapist',
      text: 'Hello Alex, I hope you are having a peaceful morning. Were you able to complete the CBT breathing exercise worksheet from Tuesday?',
      timestamp: '09:15 AM',
    },
    {
      id: 'm2',
      sender: 'patient',
      text: 'Hi Dr. Sarah! Yes, I completed it yesterday evening and felt much more grounded afterwards.',
      timestamp: '09:30 AM',
    },
    {
      id: 'm3',
      sender: 'patient',
      text: 'I attached my completed log here for you to see.',
      timestamp: '09:31 AM',
      attachmentName: 'CBT_ThoughtLog_Alex.pdf',
    },
    {
      id: 'm4',
      sender: 'therapist',
      text: 'Great work on your daily mindfulness journal! Let us review item #3 in our session tomorrow.',
      timestamp: '10:42 AM',
    },
  ],
  'thread-2': [
    {
      id: 'm10',
      sender: 'therapist',
      text: 'Your upcoming session for Friday at 2:00 PM is confirmed. See you then!',
      timestamp: 'Yesterday 3:00 PM',
    },
  ],
};

export const PatientMessagesPage: React.FC = () => {
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');

  const activeThread = MOCK_THREADS.find((t) => t.id === activeThreadId) || MOCK_THREADS[0];
  const activeMessages = messages[activeThreadId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: 'patient',
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMsg],
    }));

    setNewMessageText('');
  };

  return (
    <div className="space-y-6 text-left w-full">
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

      {/* Main Messaging Layout */}
      <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[600px] overflow-hidden">
        {/* Left Column: Conversations List (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#c3c6d6]/30 flex flex-col bg-[#f8f9ff]/50">
          <div className="p-4 border-b border-[#c3c6d6]/30 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {MOCK_THREADS.filter((t) =>
              t.therapistName.toLowerCase().includes(searchQuery.toLowerCase()),
            ).map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full p-4 text-left flex items-start gap-3 transition cursor-pointer ${
                  activeThreadId === thread.id
                    ? 'bg-white border-l-4 border-l-[#003d9b] shadow-2xs'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.avatarUrl}
                    alt={thread.therapistName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      thread.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-[#191c1e] truncate">
                      {thread.therapistName}
                    </h4>
                    <span className="text-[10px] text-[#737685] shrink-0">{thread.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-[#003d9b] font-medium truncate">
                    {thread.specialty}
                  </p>
                  <p className="text-xs text-[#51606f] truncate mt-1">{thread.lastMessage}</p>
                </div>

                {thread.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center/Right Column: Active Conversation (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-[#c3c6d6]/30 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeThread.avatarUrl}
                  alt={activeThread.therapistName}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    activeThread.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#191c1e]">{activeThread.therapistName}</h3>
                <p className="text-xs text-[#003d9b] font-semibold">{activeThread.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Session
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto bg-[#f8f9ff]/30 min-h-[380px]">
            <div className="text-center my-2">
              <span className="text-[10px] font-semibold text-[#737685] bg-white border border-[#c3c6d6]/40 px-3 py-1 rounded-full shadow-2xs">
                Session Encryption Verified • Today
              </span>
            </div>

            {activeMessages.map((msg) => {
              const isPatient = msg.sender === 'patient';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-2xs ${
                      isPatient
                        ? 'bg-[#003d9b] text-white rounded-br-xs'
                        : 'bg-white text-[#191c1e] border border-[#c3c6d6]/40 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.attachmentName && (
                      <div
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold ${
                          isPatient
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-[#f8f9ff] border-slate-200 text-[#003d9b]'
                        }`}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="truncate">{msg.attachmentName}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#737685] mt-1 px-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {msg.timestamp}
                    {isPatient && <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-[#c3c6d6]/30 bg-white space-y-2"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2.5 text-[#51606f] hover:text-[#003d9b] hover:bg-[#f8f9ff] rounded-xl transition cursor-pointer"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={`Message ${activeThread.therapistName}...`}
                className="flex-1 px-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
              />

              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="px-4 py-2.5 bg-[#003d9b] hover:bg-[#0052cc] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-[#737685] text-center">
              For medical emergencies, please call emergency services directly.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientMessagesPage;
