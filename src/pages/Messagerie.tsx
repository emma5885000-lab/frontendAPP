import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Loader2, Send, MessageCircle, Users } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface Contact {
  id: number;
  username: string;
  email: string;
  role: string;
  is_assigned?: boolean;
}

interface Conversation {
  contact: Contact;
  last_message: {
    content: string;
    created_at: string | null;
    is_from_me: boolean;
  };
  unread_count: number;
}

interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  created_at: string;
  is_read: boolean;
}

function Messagerie() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  // Scroll automatique vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ================== CHARGER LES CONTACTS ET CONVERSATIONS ================== */
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Charger les contacts disponibles
        const contactsRes = await axios.get(`${API_BASE}/users/contacts/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setContacts(contactsRes.data);

        // Charger les conversations existantes
        const conversationsRes = await axios.get(`${API_BASE}/chat/messages/conversations/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setConversations(conversationsRes.data);
      } catch (err) {
        console.error('Erreur chargement données:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  /* ================== OUVRIR UNE CONVERSATION ================== */
  const openConversation = async (contact: Contact) => {
    setSelectedContact(contact);
    setShowAllContacts(false);
    
    try {
      // Récupérer les messages entre l'utilisateur et le contact sélectionné
      const res = await axios.get(`${API_BASE}/chat/messages/`, {
        headers: { Authorization: `Token ${token}` },
        params: { with_user: contact.id }
      });
      
      setMessages(res.data);
      
      // Marquer les messages comme lus
      await axios.post(`${API_BASE}/chat/messages/mark_as_read/`, 
        { contact_id: contact.id },
        { headers: { Authorization: `Token ${token}` }}
      );
      
      // Mettre à jour le compteur de messages non lus dans les conversations
      setConversations(prev => prev.map(conv => 
        conv.contact.id === contact.id 
          ? { ...conv, unread_count: 0 }
          : conv
      ));
    } catch (err) {
      console.error("Erreur lors de la récupération des messages:", err);
    }
  };

  /* ================== ENVOYER MESSAGE ================== */
  const sendMessage = async () => {
    if (!message.trim() || !selectedContact || sendingMessage) return;

    setSendingMessage(true);
    
    try {
      const res = await axios.post(`${API_BASE}/chat/messages/`, {
        receiver: selectedContact.id,
        content: message
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      
      // Ajouter le nouveau message à la liste
      setMessages(prev => [...prev, res.data]);
      setMessage('');
      
      // Mettre à jour la conversation dans la liste
      const existingConv = conversations.find(c => c.contact.id === selectedContact.id);
      if (existingConv) {
        setConversations(prev => prev.map(conv => 
          conv.contact.id === selectedContact.id 
            ? {
                ...conv,
                last_message: {
                  content: message,
                  created_at: new Date().toISOString(),
                  is_from_me: true
                }
              }
            : conv
        ));
      } else {
        // Créer une nouvelle conversation
        setConversations(prev => [{
          contact: selectedContact,
          last_message: {
            content: message,
            created_at: new Date().toISOString(),
            is_from_me: true
          },
          unread_count: 0
        }, ...prev]);
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Déterminer le titre de la liste de contacts selon le rôle
  const getContactTitle = () => {
    if (user?.role === 'patient') {
      return '👨‍⚕️ Médecins';
    }
    return '👤 Patients';
  };

  // Déterminer le préfixe du nom de contact
  const getContactPrefix = (contact: Contact) => {
    return contact.role === 'doctor' ? 'Dr. ' : '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  // Fusionner contacts et conversations pour afficher tous les contacts disponibles
  const getDisplayList = () => {
    if (showAllContacts) {
      return contacts;
    }
    
    // Afficher les conversations existantes + les contacts sans conversation
    const conversationContactIds = conversations.map(c => c.contact.id);
    const contactsWithoutConv = contacts.filter(c => !conversationContactIds.includes(c.id));
    
    return [
      ...conversations.map(c => c.contact),
      ...contactsWithoutConv
    ];
  };

  const displayList = getDisplayList();

  return (
    <div className="flex max-w-5xl h-[600px] mx-auto my-10 rounded-xl overflow-hidden shadow-xl bg-white">
      
      {/* ================= LISTE DES CONTACTS ================= */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-center text-blue-600 font-semibold">{getContactTitle()}</h3>
          <button
            onClick={() => setShowAllContacts(!showAllContacts)}
            className="w-full mt-2 text-xs text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1"
          >
            <Users size={14} />
            {showAllContacts ? 'Voir conversations' : 'Voir tous les contacts'}
          </button>
        </div>

        {/* Liste des contacts */}
        <div className="flex-1 overflow-y-auto p-2">
          {displayList.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Aucun contact disponible
            </p>
          ) : (
            displayList.map(contact => {
              const conv = conversations.find(c => c.contact.id === contact.id);
              
              return (
                <div
                  key={contact.id}
                  onClick={() => openConversation(contact)}
                  className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition-colors border border-gray-200 ${
                    selectedContact?.id === contact.id ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    contact.role === 'doctor' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {contact.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-gray-800 truncate">
                        {getContactPrefix(contact)}{contact.username}
                      </strong>
                      {conv && conv.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    {conv && conv.last_message.content && (
                      <p className="text-xs text-gray-500 truncate">
                        {conv.last_message.is_from_me && 'Vous: '}
                        {conv.last_message.content}
                      </p>
                    )}
                    {!conv && contact.is_assigned && (
                      <p className="text-xs text-green-600 font-medium">Votre médecin</p>
                    )}
                    {!conv && !contact.is_assigned && (
                      <p className="text-xs text-gray-400">Nouvelle conversation</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= ZONE DE CHAT ================= */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-200 font-bold bg-slate-100">
          {selectedContact
            ? `💬 Conversation avec ${getContactPrefix(selectedContact)}${selectedContact.username}`
            : 'Sélectionnez un contact'}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
          {!selectedContact ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle size={48} className="mb-2" />
              <p>Sélectionnez un contact pour commencer une conversation</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle size={48} className="mb-2" />
              <p>Aucun message. Commencez la conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromCurrentUser = selectedContact && msg.sender !== selectedContact.id;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl mb-2.5 text-sm ${
                      isFromCurrentUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div>{msg.content}</div>
                      <div className="text-xs mt-1 opacity-70 flex items-center gap-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {isFromCurrentUser && (
                          <span className="ml-1">
                            {msg.is_read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedContact && (
          <div className="flex gap-3 p-4 border-t border-gray-200">
            <input
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Écrire un message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={sendingMessage}
            />
            <button 
              className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              onClick={sendMessage}
              disabled={sendingMessage || !message.trim()}
            >
              {sendingMessage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Envoyer
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Messagerie;
