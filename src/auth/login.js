import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://goalstats-api.onrender.com/api/login/', {
        username,
        password
      });

      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', response.data.token);
      
      // Redirigir al usuario o actualizar el estado de la aplicación
      console.log('Login exitoso');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar sesión</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;