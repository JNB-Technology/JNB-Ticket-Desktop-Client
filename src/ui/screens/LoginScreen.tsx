import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUserTie, faUser, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import './LoginScreen.css'; // Import the CSS file for styling

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('Super Admin'); // Add state for role

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, role);
  };

  useEffect(() => {
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2,
      dx: Math.random() * 0.5 - 0.25,
      dy: Math.random() * 0.5 - 0.25,
    }));

    const drawParticles = () => {
      ctx!.clearRect(0, 0, w, h);
      particles.forEach(p => {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--particle-color');
        ctx!.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    };

    drawParticles();
  }, []);

  return (
    <div className="login-container">
      <canvas id="particles"></canvas>
      <div className="login-panel">
        <h1 className="login-title">Sign In</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group custom-dropdown">
            <label htmlFor="role">Login as</label>
            <div className="dropdown">
              <button className="dropdown-button">
                {role === 'Super Admin' && <FontAwesomeIcon icon={faUserShield} />}
                {role === 'Agent' && <FontAwesomeIcon icon={faUser} />}
                {role === 'Business Admin' && <FontAwesomeIcon icon={faUserTie} />}
                {role === 'Employee' && <FontAwesomeIcon icon={faUserSecret} />}
                <span>{role}</span>
              </button>
              <div className="dropdown-content">
                <div onClick={() => setRole('Super Admin')}>
                  <FontAwesomeIcon icon={faUserShield} />
                  <span>Super Admin</span>
                </div>
                <div onClick={() => setRole('Agent')}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Agent</span>
                </div>
                <div onClick={() => setRole('Business Admin')}>
                  <FontAwesomeIcon icon={faUserTie} />
                  <span>Business Admin</span>
                </div>
                <div onClick={() => setRole('Employee')}>
                  <FontAwesomeIcon icon={faUserSecret} />
                  <span>Employee</span>
                </div>
              </div>
            </div>
          </div>
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
