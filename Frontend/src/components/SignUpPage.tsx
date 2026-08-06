import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const { signup, isLoading } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, displayName.trim());
      toast.success('Account created successfully!');
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists');
      } else if (code === 'auth/weak-password') {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address');
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="auth-header">
          <motion.div
            className="auth-icon-ring"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Sparkles size={24} />
          </motion.div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join and start summarizing articles instantly</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`auth-input-group ${focusedField === 'name' ? 'focused' : ''}`}>
            <User size={18} className="auth-input-icon" />
            <input
              id="signup-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Display name"
              className="auth-input"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div className={`auth-input-group ${focusedField === 'email' ? 'focused' : ''}`}>
            <Mail size={18} className="auth-input-icon" />
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="Email address"
              className="auth-input"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={`auth-input-group ${focusedField === 'password' ? 'focused' : ''}`}>
            <Lock size={18} className="auth-input-icon" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="Password (min. 6 characters)"
              className="auth-input"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className={`auth-input-group ${focusedField === 'confirm' ? 'focused' : ''}`}>
            <Lock size={18} className="auth-input-icon" />
            <input
              id="signup-confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
              placeholder="Confirm password"
              className="auth-input"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <motion.button
            id="signup-btn"
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="btn-text">
                <Sparkles size={16} className="spin-icon" />
                Creating account...
              </span>
            ) : (
              <span className="btn-text">
                <UserPlus size={16} />
                Create Account
              </span>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
