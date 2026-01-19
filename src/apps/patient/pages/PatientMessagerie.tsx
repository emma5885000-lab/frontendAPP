import React, { useState } from 'react';
import { FaPaperPlane, FaArrowLeft, FaPhone, FaVideo } from 'react-icons/fa';

interface Message {
  id: number;
  text: string;
  sender: 'patient' | 'medecin';
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: 'Dr. Martin',
    role: 'Pneumologue',
    lastMessage: 'Vos résultats sont encourageants',
    time: '10:30',
    unread: 2,
    avatar: 'M'
  },
  {
    id: 2,
    name: 'Dr. Dupont',
    role: 'Médecin généraliste',
    lastMessage: 'Prenez rendez-vous la semaine prochaine',
    time: 'Hier',
    unread: 0,
    avatar: 'D'
  }
];

const mockMessages: Message[] = [
  { id: 1, text: 'Bonjour Docteur, j\'ai une question concernant mes derniers résultats.', sender: 'patient', time: '10:00' },
  { id: 2, text: 'Bonjour ! Bien sûr, je vous écoute.', sender: 'medecin', time: '10:05' },
  { id: 3, text: 'Ma SpO2 était à 94% ce matin, est-ce normal ?', sender: 'patient', time: '10:10' },
  { id: 4, text: 'C\'est légèrement en dessous de la normale. Avez-vous ressenti un essoufflement ?', sender: 'medecin', time: '10:15' },
  { id: 5, text: 'Non, je me sentais bien.', sender: 'patient', time: '10:20' },
  { id: 6, text: 'Vos résultats sont encourageants. Continuez à surveiller et contactez-moi si ça descend en dessous de 92%.', sender: 'medecin', time: '10:30' },
];

function PatientMessagerie() {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'patient',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  // Vue conversation
  if (selectedConv) {
    return (
      <div className="flex flex-col h-full">
        {/* Header conversation */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => setSelectedConv(null)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' }}>
            {selectedConv.avatar}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{selectedConv.name}</div>
            <div className="text-xs text-gray-500">{selectedConv.role}</div>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FaPhone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FaVideo size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'patient'
                    ? 'bg-sky-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className={`text-xs mt-1 ${
                  msg.sender === 'patient' ? 'text-sky-100' : 'text-gray-400'
                }`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Votre message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={sendMessage}
              className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white active:bg-emerald-600"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Liste des conversations
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Messagerie</h1>
      <p className="text-sm text-gray-500 mb-4">Vos conversations avec les médecins</p>

      <div className="space-y-3">
        {mockConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedConv(conv)}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm active:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' }}>
                {conv.avatar}
              </div>
              {conv.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{conv.name}</span>
                <span className="text-xs text-gray-400">{conv.time}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{conv.role}</div>
              <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PatientMessagerie;
