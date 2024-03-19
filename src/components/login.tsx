import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login?email=' + username + '&password=' + password, {
        method: 'POST',
      });
      const data = await response.json();
  
      if (response.ok && data.code === 200) {
        const { userId, username, profile } = data.msg; // 假设后端返回了用户名和用户资料
        login(username, profile); // 更新 AuthContext 中的状态
        navigate('/work'); // 导航到 /work 页面
      } else {
        setError('登录失败，请检查用户名和密码。');
      }
    } catch (error) {
      setError('登录失败，请检查用户名和密码。');
    }
  };

  // return (
  //   <div>
  //     <h2>登录</h2>
  //     <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
  //       <div>
  //         <label htmlFor="username">用户名：</label>
  //         <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
  //       </div>
  //       <div>
  //         <label htmlFor="password">密码：</label>
  //         <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  //       </div>
  //       <button type="submit">登录</button>
  //     </form>
  //     {error && <p style={{ color: 'red' }}>{error}</p>}
  //   </div>
  // );
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-4">
          <img src="public\logo-tiny.png" alt="logo" className="h-12 w-12" /> {/* Replace with your logo URL */}
        </div>
        <h2 className="text-center text-2xl font-bold mb-4">Welcome</h2>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label htmlFor="username" className="block mb-1 font-semibold">Email</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Enter your email"/>
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Enter your password"/>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600">
            LOGIN
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="text-center mt-4">
          <p>Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
