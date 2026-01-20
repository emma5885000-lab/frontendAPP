import React, { useState, useEffect } from 'react';
import { FaMicrochip, FaPlus, FaEdit, FaTrash, FaKey, FaCopy, FaCheck, FaTimes, FaSync } from 'react-icons/fa';
import { AiOutlineLoading3Quarters, AiOutlineWarning } from 'react-icons/ai';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface Device {
  id: string;
  name: string;
  device_key: string;
  is_active: boolean;
  created_at: string;
  last_data_at: string | null;
}

function PatientDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const token = useAuthStore(state => state.token);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/devices/my-devices/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setDevices(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement devices:', err);
      setError('Impossible de charger vos appareils');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDevices();
  }, [token]);

  const handleAddDevice = async () => {
    if (!newDeviceName.trim()) return;
    
    try {
      setActionLoading(true);
      await axios.post(`${API_BASE}/devices/create/`, 
        { name: newDeviceName },
        { headers: { Authorization: `Token ${token}` } }
      );
      setNewDeviceName('');
      setShowAddModal(false);
      fetchDevices();
    } catch (err) {
      console.error('Erreur création device:', err);
      setError('Impossible de créer l\'appareil');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDevice = async () => {
    if (!selectedDevice || !newDeviceName.trim()) return;
    
    try {
      setActionLoading(true);
      await axios.put(`${API_BASE}/devices/${selectedDevice.id}/update/`, 
        { name: newDeviceName, is_active: selectedDevice.is_active },
        { headers: { Authorization: `Token ${token}` } }
      );
      setNewDeviceName('');
      setShowEditModal(false);
      setSelectedDevice(null);
      fetchDevices();
    } catch (err) {
      console.error('Erreur mise à jour device:', err);
      setError('Impossible de mettre à jour l\'appareil');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDevice = async (device: Device) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${device.name}" ?`)) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`${API_BASE}/devices/${device.id}/delete/`, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchDevices();
    } catch (err) {
      console.error('Erreur suppression device:', err);
      setError('Impossible de supprimer l\'appareil');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (device: Device) => {
    try {
      setActionLoading(true);
      await axios.put(`${API_BASE}/devices/${device.id}/update/`, 
        { is_active: !device.is_active },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchDevices();
    } catch (err) {
      console.error('Erreur toggle device:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerateKey = async (device: Device) => {
    if (!confirm('Régénérer la clé ? L\'ancienne clé ne fonctionnera plus.')) return;
    
    try {
      setActionLoading(true);
      await axios.post(`${API_BASE}/devices/${device.id}/regenerate-key/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchDevices();
    } catch (err) {
      console.error('Erreur régénération clé:', err);
      setError('Impossible de régénérer la clé');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string, deviceId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(deviceId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openEditModal = (device: Device) => {
    setSelectedDevice(device);
    setNewDeviceName(device.name);
    setShowEditModal(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Jamais';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-sky-500 mb-3" />
        <span className="text-gray-500 text-sm">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mes appareils</h1>
          <p className="text-sm text-gray-500">{devices.length} appareil(s) enregistré(s)</p>
        </div>
        <button
          onClick={() => { setNewDeviceName(''); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium active:bg-emerald-600"
        >
          <FaPlus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
          <AiOutlineWarning size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <FaTimes size={14} />
          </button>
        </div>
      )}

      {/* Liste des devices */}
      {devices.length > 0 ? (
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header du device */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    device.is_active ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <FaMicrochip size={24} className={device.is_active ? 'text-emerald-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{device.name}</div>
                    <div className="text-xs text-gray-400">
                      Dernière donnée: {formatDate(device.last_data_at)}
                      {device.device_key === 'f3a3e94db29b4887946ee88a003c10649c3b6f533d024ed6f34a9d6831fb71f3' && (
                        <span className="ml-2 text-amber-600 font-medium">(capteur COV instable)</span>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    device.is_active 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {device.is_active ? 'Actif' : 'Inactif'}
                  </div>
                </div>
              </div>

              {/* Clé du device */}
              <div className="p-4 bg-gray-50">
                <div className="text-xs text-gray-500 mb-2">Clé d'authentification</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white px-3 py-2 rounded-lg border border-gray-200 text-gray-600 overflow-hidden text-ellipsis">
                    {device.device_key.substring(0, 20)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(device.device_key, device.id)}
                    className="p-2 bg-sky-100 text-sky-600 rounded-lg active:bg-sky-200"
                    title="Copier la clé"
                  >
                    {copiedKey === device.id ? <FaCheck size={16} /> : <FaCopy size={16} />}
                  </button>
                  <button
                    onClick={() => handleRegenerateKey(device)}
                    className="p-2 bg-sky-100 text-sky-600 rounded-lg active:bg-sky-200"
                    title="Régénérer la clé"
                  >
                    <FaSync size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 flex items-center gap-2 border-t border-gray-100">
                <button
                  onClick={() => handleToggleActive(device)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                    device.is_active 
                      ? 'bg-gray-100 text-gray-600' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {device.is_active ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => openEditModal(device)}
                  className="p-2 bg-sky-100 text-sky-600 rounded-lg"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteDevice(device)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMicrochip size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">Aucun appareil enregistré</p>
          <button
            onClick={() => { setNewDeviceName(''); setShowAddModal(true); }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium"
          >
            Ajouter un appareil
          </button>
        </div>
      )}

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Nouvel appareil</h2>
            <input
              type="text"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="Nom de l'appareil"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleAddDevice}
                disabled={actionLoading || !newDeviceName.trim()}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                ) : (
                  <>
                    <FaPlus size={14} />
                    <span>Créer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Modifier l'appareil</h2>
            <input
              type="text"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="Nom de l'appareil"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowEditModal(false); setSelectedDevice(null); }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateDevice}
                disabled={actionLoading || !newDeviceName.trim()}
                className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                ) : (
                  <>
                    <FaCheck size={14} />
                    <span>Enregistrer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDevices;
