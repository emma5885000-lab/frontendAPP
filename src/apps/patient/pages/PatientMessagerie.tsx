import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { BOTTOM_NAV_HEIGHT } from '../components/MobileNavbar';

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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Détecter l'ouverture du clavier (mobile)
  useEffect(() => {
    const handleResize = () => {
      // Sur mobile, quand le clavier s'ouvre, la hauteur du viewport diminue
      const isKeyboard = window.visualViewport 
        ? window.visualViewport.height < window.innerHeight * 0.75
        : false;
      setIsKeyboardOpen(isKeyboard);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  // Scroll vers le bas quand un nouveau message arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    // Calculer le padding bottom: hauteur nav + safe area (sauf si clavier ouvert)
    const bottomPadding = isKeyboardOpen 
      ? 0 
      : `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`;

    return (
      <div 
        className="flex flex-col"
        style={{ 
          height: '100%',
          marginBottom: isKeyboardOpen ? 0 : undefined
        }}
      >
        {/* Header conversation */}
        <div className="px-4 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' }}>
          <button 
            onClick={() => setSelectedConv(null)}
            className="p-2 -ml-2 text-white"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
            {selectedConv.avatar}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white text-sm">{selectedConv.name}</div>
            <div className="text-xs text-sky-100">{selectedConv.role}</div>
          </div>
        </div>

        {/* Messages - zone scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl ${
                  msg.sender === 'patient'
                    ? 'bg-sky-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className={`text-xs mt-1 ${
                  msg.sender === 'patient' ? 'text-sky-200' : 'text-gray-400'
                }`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - positionné au-dessus de la bottom nav */}
        <div 
          className="bg-white p-3 flex-shrink-0 border-t border-gray-100"
          style={{ marginBottom: bottomPadding }}
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 flex-shrink-0"
            >
              <FaPaperPlane size={16} />
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

      <div className="bg-white rounded-xl overflow-hidden">
        {mockConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedConv(conv)}
            className="w-full flex items-center gap-3 p-4 active:bg-gray-50 transition-colors"
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
