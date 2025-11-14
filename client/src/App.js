import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const API_BASE = 'http://localhost:4000';

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      sessionStorage.setItem('token', data.token);
      setMessage('Login bem-sucedido. Token salvo em sessionStorage.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function callPrivate() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Nenhum token encontrado. Faça login primeiro.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/private`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao acessar rota privada');
      setMessage(`Resposta privada: ${JSON.stringify(data)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('token');
    setMessage('Logout: token removido de sessionStorage.');
  }

  return (
    <div className='principal'>
    <div className='container'>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <label>
          Usuário
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <div style={{ height: 8 }} />
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>Entrar</button>
          <button type="button" onClick={callPrivate} disabled={loading} style={{ marginLeft: 8 }}>
            Chamar /private
          </button>
          <button type="button" onClick={handleLogout} style={{ marginLeft: 8 }}>
            Logout
          </button>
        </div>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <pre style={{ background: '#f5f5f5', padding: 8 }}>{message}</pre>}

      <hr />
      <p>Credenciais de teste: <b>testuser / testpass</b></p>
    </div>
    </div>
  );
}

export default App;
