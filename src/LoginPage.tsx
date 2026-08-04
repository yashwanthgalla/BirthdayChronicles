import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { loginUser } from './authConfig';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginUser(username, password);
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.message || 'Invalid username or password.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    }, 400);
  };

  return (
    <div className="login-page-container">
      {/* Background ambient lighting */}
      <div className="login-bg-glow-1" />
      <div className="login-bg-glow-2" />

      {/* Main Glass Card */}
      <div className={`login-card ${isShaking ? 'shake-anim' : ''}`}>
        <div className="login-header">
          <h1 className="login-title">Birthday Chronicles</h1>
          <p className="login-subtitle">
            Enter your secret credentials to unlock this portal.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Error Banner */}
          {errorMessage && (
            <div className="error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="input-group">
            <label className="input-label" htmlFor="login-username">
              Username
            </label>
            <div className="input-wrapper">
              <input
                id="login-username"
                type="text"
                className="login-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
              <User className="input-icon" size={18} />
            </div>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label className="input-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Lock className="input-icon" size={18} />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>UNLOCKING...</span>
            ) : (
              <>
                <span>ENTER WEBSITE</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
