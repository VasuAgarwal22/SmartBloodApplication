import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import AppImage from '../../components/AppImage';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(null);
  const [fullNameValid, setFullNameValid] = useState(null);
  const [shake, setShake] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // Real-time validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(email ? (emailRegex.test(email) ? true : false) : null);
  }, [email]);

  useEffect(() => {
    setPasswordValid(password ? (password.length >= 8 ? true : false) : null);
  }, [password]);

  useEffect(() => {
    if (isSignUp) {
      setConfirmPasswordValid(confirmPassword ? (confirmPassword === password ? true : false) : null);
    }
  }, [confirmPassword, password, isSignUp]);

  useEffect(() => {
    if (isSignUp) {
      setFullNameValid(fullName ? (fullName.trim().length > 0 ? true : false) : null);
    }
  }, [fullName, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShake(false);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setIsSubmitting(false);
          return;
        }

        const { data, error } = await signUp(email, password, fullName, role);
        if (error) {
          setError(error.message);
          setShake(true);
          setTimeout(() => setShake(false), 500);
        } else {
          // Account created successfully, but email verification is required
          setSuccess('Please check your email and verify your account before signing in.');
          setIsSignUp(false);
          // Clear form fields
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFullName('');
          setRole('user');
          setEmailValid(null);
          setPasswordValid(null);
          setConfirmPasswordValid(null);
          setFullNameValid(null);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
          setShake(true);
          setTimeout(() => setShake(false), 500);
        } else {
          // Success feedback before redirect
          setTimeout(() => navigate(from, { replace: true }), 1000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login - SmartBloodAllocation</title>
        <meta name="description" content="Login to access the Smart Blood Allocation dashboard" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full">
          <motion.div
            className={`bg-card border border-border rounded-xl shadow-elevation-lg p-8 ${shake ? 'animate-shake' : ''}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="text-center mb-8">
              <AppImage
                src="/assets/blood-image.jpeg"
                alt="Blood Donation Image"
                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
              />
              <h1 className="text-2xl font-bold mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp
                  ? 'Sign up to access the Smart Blood Allocation System'
                  : 'Sign in to access the Smart Blood Allocation System'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email Address"
                floating
                isValid={emailValid}
                helperText="Enter a valid email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <div>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  floating
                  helperText="Password must be at least 8 characters"
                  showPasswordToggle
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {!isSignUp && (
                  <div className="mt-1 text-right">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 underline"
                      onClick={() => alert("Forgot Password functionality not implemented yet")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {isSignUp && (
                <>
                  <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    floating
                    helperText="Passwords must match"
                    showPasswordToggle
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />

                  <Input
                    id="fullName"
                    type="text"
                    label="Full Name"
                    floating
                    isValid={fullNameValid}
                    helperText="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />

                  <Select
                    id="role"
                    label="Account Type"
                    value={role}
                    onChange={setRole}
                    options={[
                      { value: 'user', label: 'User (Donor/Recipient)' },
                      { value: 'hospital', label: 'Hospital' },
                      { value: 'admin', label: 'Administrator' }
                    ]}
                    placeholder="Select account type"
                    required
                    disabled={isSubmitting}
                    description="Choose the type of account you want to create"
                  />
                </>
              )}

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <p className="text-success text-sm">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full transition-transform duration-150 hover:scale-105 active:scale-95"
                disabled={isSubmitting}
                iconName={isSubmitting ? "Loader2" : undefined}
                iconPosition="left"
              >
                {isSubmitting
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setFullName('');
                  setRole('user');
                  setEmailValid(null);
                  setPasswordValid(null);
                  setConfirmPasswordValid(null);
                  setFullNameValid(null);
                }}
                className="text-sm text-primary hover:text-primary/80 underline"
                disabled={isSubmitting}
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            <div className="mt-4 text-center flex items-center justify-center space-x-2">
              <Icon name="Shield" size={16} className="text-primary" />
              <p className="text-sm text-muted-foreground">
                Secure access to emergency blood allocation system
              </p>
              <div className="relative group">
                <Icon name="Info" size={14} className="text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Your credentials are encrypted
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
