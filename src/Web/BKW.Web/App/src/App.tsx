import React from 'react';
import AuthState from './context/auth/AuthState';

function App() {
  return (
    <AuthState>
      <h1>
        Secure Image Webshop
      </h1>
    </AuthState>
  );
}

export default App;
