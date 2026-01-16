import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Thermometer, Activity } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Profil() {
  // Infos utilisateur depuis le store Zustand
  const user = useAuthStore(state => state.user);
  const storedUsername = user?.username || "Utilisateur";
  const storedEmail = user?.email || "email@exemple.com";
  const storedPhone = "+225 XX XX XX XX XX";
  const storedAddress = "Abidjan, Côte d'Ivoire";

  const storedSpecialty = "Pneumologie";
  const storedExperience = "15 ans";
  const storedPatients = "245 patients";
  const storedTemperature = "36.7°C";
  const storedDiagnostics = "350";
  const storedSuccessRate = "92%";
  const storedCertifications = "Board Certified, IA Pneumologie";

  // Etats pour édition
  const [username, setUsername] = useState(storedUsername);
  const [email, setEmail] = useState(storedEmail);
  const [phone, setPhone] = useState(storedPhone);
  const [address, setAddress] = useState(storedAddress);

  const [specialty, setSpecialty] = useState(storedSpecialty);
  const [experience, setExperience] = useState(storedExperience);
  const [patients, setPatients] = useState(storedPatients);
  const [temperature, setTemperature] = useState(storedTemperature);
  const [diagnostics, setDiagnostics] = useState(storedDiagnostics);
  const [successRate, setSuccessRate] = useState(storedSuccessRate);
  const [certifications, setCertifications] = useState(storedCertifications);

  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    // Infos personnelles
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("address", address);

    // Infos professionnelles
    localStorage.setItem("specialty", specialty);
    localStorage.setItem("experience", experience);
    localStorage.setItem("patients", patients);
    localStorage.setItem("temperature", temperature);
    localStorage.setItem("diagnostics", diagnostics);
    localStorage.setItem("successRate", successRate);
    localStorage.setItem("certifications", certifications);

    setEditMode(false);
    alert("Profil mis à jour avec succès !");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profil</h1>
        <p className="text-base text-gray-500">Gérez vos informations personnelles et professionnelles</p>
      </div>

      {/* En-tête du profil */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-5xl font-bold">
            {username.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {username}
            </h2>
            <p className="text-base text-gray-500 mb-4">
              {specialty} • Centre Hospitalier Universitaire
            </p>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                Actif
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Certifié
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton pour activer le mode édition */}
      <div className="text-right mb-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-semibold text-white cursor-pointer transition-colors ${
            editMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {editMode ? 'Annuler' : 'Modifier le profil'}
        </button>
      </div>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Informations personnelles
          </h3>
          <div className="flex flex-col gap-4">
            {[ 
              { icon: User, label: 'Nom complet', value: username, setter: setUsername },
              { icon: Mail, label: 'Email', value: email, setter: setEmail },
              { icon: Phone, label: 'Téléphone', value: phone, setter: setPhone },
              { icon: MapPin, label: 'Adresse', value: address, setter: setAddress }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 pb-4 ${index < 3 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-800">{item.value}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations professionnelles éditables */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Informations professionnelles
          </h3>
          <div className="flex flex-col gap-4">
            {[
              { icon: Award, label: 'Spécialité', value: specialty, setter: setSpecialty },
              { icon: Calendar, label: 'Années d\'expérience', value: experience, setter: setExperience },
              { icon: User, label: 'Patients suivis', value: patients, setter: setPatients },
              { icon: Thermometer, label: 'Température moyenne suivie', value: temperature, setter: setTemperature },
              { icon: Activity, label: 'Diagnostics réalisés', value: diagnostics, setter: setDiagnostics },
              { icon: Award, label: 'Taux de réussite des traitements', value: successRate, setter: setSuccessRate },
              { icon: Award, label: 'Certifications', value: certifications, setter: setCertifications }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 pb-4 ${index < 6 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-800">{item.value}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bouton Enregistrer */}
      {editMode && (
        <div className="text-right mb-6">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer hover:bg-emerald-600 transition-colors"
          >
            Enregistrer les modifications
          </button>
        </div>
      )}
    </div>
  );
}

export default Profil;
