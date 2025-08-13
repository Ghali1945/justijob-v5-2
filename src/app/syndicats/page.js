
// ============================================
// 📁 src/app/syndicats/page.js (CORRIGÉ)
// ============================================
'use client';

import React, { useState } from 'react';
import SyndicatAuth from '../../components/syndicats/SyndicatAuth';
import Dashboard from '../../components/syndicats/Dashboard';

export default function SyndicatsPage() {
  const [user, setUser] = useState(null);
  const [syndicat, setSyndicat] = useState(null);

  const handleLogin = (loggedUser, userSyndicat) => {
    setUser(loggedUser);
    setSyndicat(userSyndicat);
  };

  const handleLogout = () => {
    setUser(null);
    setSyndicat(null);
  };

  if (!user || !syndicat) {
    return <SyndicatAuth onLogin={handleLogin} />;
  }

  return <Dashboard user={user} syndicat={syndicat} onLogout={handleLogout} />;
}