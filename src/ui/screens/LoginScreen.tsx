import React, { useState } from 'react';
import './LoginScreen.css'; // Import the CSS file for styling

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-panel">
        <h1 className="login-title">Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group remember-me">
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <div className="login-footer">
          <a href="#" className="forgot-password">Forgot password?</a>
          <a href="#" className="sign-up">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
