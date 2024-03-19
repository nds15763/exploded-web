import React, { useState } from 'react';
// import { useAuth } from '@reactfire/auth';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const history = useHistory();

  const handleGoogleLogin = async () => {
    const provider = new auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    history.push('/'); // 登录成功后跳转到首页
  };

  const handleEmailAndPasswordLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleEmailAndPasswordLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
