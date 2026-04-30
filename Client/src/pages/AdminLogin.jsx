import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background3D from '../components/Background3D';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://future-fs-01-8c7x.onrender.com/api/admin/login', { username, password });
      
      if (res.status === 401) {
        alert("Invalid Username Or pasword")
      }
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-300">
      <Background3D />
      <div className="relative z-10 glass p-8 rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 mb-4 border rounded bg-white/70 dark:bg-dark-200/70" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded bg-white/70 dark:bg-dark-200/70" required />
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded">Login</button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
