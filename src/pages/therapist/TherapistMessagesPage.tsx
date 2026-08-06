import React, { useState } from 'react';
import { Search, Send, Paperclip, Phone, Video, CheckCheck, Zap } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

interface ChatConversation {
  id: string;
  patientName: string;
  patientAvatar: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

interface Message {
  id: string;
  sender: 'therapist' | 'patient';
  text: string;
  time: string;
}

let msgCounter = 1000;

export const TherapistMessagesPage: React.FC = () => {
  const addToast = useUIStore((state: UIState) => state.addToast);

  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'chat-1',
      patientName: 'Alex Patient',
      patientAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      unreadCount: 2,
      lastMessage: 'I completed the thought journal exercise from our last session!',
      lastMessageTime: '10:14 AM',
    },
    {
      id: 'chat-2',
      patientName: 'Jordan Miller',
      patientAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isOnline: false,
      unreadCount: 1,
      lastMessage: 'Will we be covering breathing techniques today?',
      lastMessageTime: 'Yesterday',
    },
    {
      id: 'chat-3',
      patientName: 'Taylor Reed',
      patientAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      unreadCount: 0,
      lastMessage: 'Thank you Dr. Connor, that grounding exercise really helped.',
      lastMessageTime: 'Aug 04',
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>('chat-1');

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    'chat-1': [
      {
        id: 'm1',
        sender: 'therapist',
        text: 'Hi Alex! Just following up to see how your morning grounding exercises went.',
        time: '09:30 AM',
      },
      {
        id: 'm2',
        sender: 'patient',
        text: 'Good morning Dr. Connor! It went really well.',
        time: '10:05 AM',
      },
      {
        id: 'm3',
        sender: 'patient',
        text: 'I completed the thought journal exercise from our last session!',
        time: '10:14 AM',
      },
    ],
    'chat-2': [
      {
        id: 'm4',
        sender: 'patient',
        text: 'Will we be covering breathing techniques today?',
        time: 'Yesterday',
      },
    ],
    'chat-3': [
      {
        id: 'm5',
        sender: 'therapist',
        text: 'Remember to practice 4-7-8 breathing whenever panic rises.',
        time: 'Aug 04',
      },
      {
        id: 'm6',
        sender: 'patient',
        text: 'Thank you Dr. Connor, that grounding exercise really helped.',
        time: 'Aug 04',
      },
    ],
  });

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation = conversations.find((c) => c.id === activeChatId) || conversations[0];
  const activeMessages = messagesMap[activeChatId] || [];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || messageInput.trim();
    if (!text) return;

    const newMsg: Message = {
      id: `m-${++msgCounter}`,
      sender: 'therapist',
      text,
      time: 'Just now',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMessage: text, lastMessageTime: 'Just now', unreadCount: 0 }
          : c,
      ),
    );

    setMessageInput('');
  };

  const quickTemplates = [
    'Friendly reminder: Our session is starting in 15 minutes!',
    'Great progress today! Please record your weekly mood diary.',
    'Could you please confirm if 2:00 PM tomorrow works for your reschedule?',
  ];

  return (
    <div className="space-y-6 text-left w-full h-[calc(100vh-140px)] flex flex-col">
      {/* Header Title */}
      <div className="pb-4 border-b border-[#c3c6d6]/40 shrink-0">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
          Patient Messages & Portal Chat
        </h1>
        <p className="text-xs md:text-sm text-[#434654] mt-1">
          Secure HIPAA-compliant clinical messaging with active patients and practice support.
        </p>
      </div>

      {/* Main Chat Interface Grid */}
      <div className="flex-1 bg-white rounded-3xl border border-[#c3c6d6]/40 shadow-xs flex overflow-hidden min-h-0">
        {/* Left Conversations Sidebar */}
        <div className="w-80 border-r border-[#c3c6d6]/40 flex flex-col bg-[#f8f9fb]/50 shrink-0">
          <div className="p-3 border-b border-[#c3c6d6]/40">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((chat) => {
              const isActive = chat.id === activeChatId;

              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setConversations((prev) =>
                      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)),
                    );
                  }}
                  className={`w-full p-4 text-left flex items-start gap-3 transition cursor-pointer ${
                    isActive ? 'bg-white shadow-2xs' : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.patientAvatar}
                      alt={chat.patientName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#191c1e] truncate">
                        {chat.patientName}
                      </h4>
                      <span className="text-[10px] text-[#505f76]">{chat.lastMessageTime}</span>
                    </div>

                    <p className="text-xs text-[#434654] truncate mt-0.5">{chat.lastMessage}</p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="bg-[#ef4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Message Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-[#c3c6d6]/40 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.patientAvatar}
                alt={activeConversation.patientName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-[#191c1e]">
                  {activeConversation.patientName}
                </h3>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Active Now • Encrypted Channel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Audio Call',
                    message: `Calling ${activeConversation.patientName}...`,
                  })
                }
                className="p-2 text-slate-500 hover:text-[#0052cc] hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Start Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Video Room Launched',
                    message: `Opening instant video portal with ${activeConversation.patientName}`,
                  })
                }
                className="p-2 text-slate-500 hover:text-[#0052cc] hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Clinical Templates Bar */}
          <div className="p-2.5 bg-[#f8f9fb] border-b border-[#c3c6d6]/30 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
            <span className="text-[#505f76] font-semibold flex items-center gap-1 shrink-0 px-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Replies:
            </span>
            {quickTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(template)}
                className="px-3 py-1 bg-white hover:bg-blue-50 text-[#0052cc] border border-[#0052cc]/20 rounded-lg text-[11px] font-semibold transition shrink-0 cursor-pointer shadow-2xs"
              >
                {template}
              </button>
            ))}
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'therapist';

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#0052cc] text-white rounded-br-none shadow-2xs'
                        : 'bg-[#f8f9fb] text-[#191c1e] border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-[#c3c6d6]/40 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Attachment',
                    message: 'Upload file or clinical homework document...',
                  })
                }
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type a clinical message or note..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] placeholder:text-[#505f76] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistMessagesPage;
