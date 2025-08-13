
// ============================================
// 📁 src/components/syndicats/index.js
// ============================================
'use client';

import React, { useState } from 'react';
import SyndicatAuth from './SyndicatAuth';
import Dashboard from './Dashboard';

const SyndicatsApp = () => {
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
};

export default SyndicatsApp;