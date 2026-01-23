import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import AppImage from '../../components/AppImage';
import Icon from '../../components/AppIcon';
import { formatAadhaar } from '../../utils/verhoeff';
import { otpService } from '../../utils/otpService';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, loading, userProfile } = useAuth();

  // Form states
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

  // Aadhaar and OTP states
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarValid, setAadhaarValid] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Interactive states
  const [focusedField, setFocusedField] = useState(null);

  // Refs and motion values
  const cardRef = useRef(null);
  const cardControls = useAnimation();

  // Start card animation on mount
  useEffect(() => {
    cardControls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.4, ease: 'easeOut' }
    });
  }, [cardControls]);

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

  // Aadhaar input handler with formatting
  const handleAadhaarChange = (e) => {
    const value = e.target.value;
    const formatted = formatAadhaar(value);
    setAadhaar(formatted);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpId(null);
    setOtp('');
    setOtpError('');
  };

  // Send OTP handler
  const handleSendOTP = async () => {
    if (!aadhaarValid) return;

    setOtpLoading(true);
    setOtpError('');

    try {
      // Mock mobile number for demo - in production, get from Aadhaar API
      const mockMobile = '+91' + Math.floor(1000000000 + Math.random() * 9000000000);

      const result = await otpService.sendOTP(aadhaar.replace(/\D/g, ''), mockMobile);

      if (result.success) {
        setOtpId(result.otpId);
        setOtpSent(true);
        setOtpError('');
      } else {
        setOtpError(result.message);
      }
    } catch (error) {
      setOtpError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOTP = async () => {
    if (!otpId || !otp.trim()) return;

    setOtpLoading(true);
    setOtpError('');

    try {
      const result = await otpService.verifyOTP(otpId, otp.trim());

      if (result.success) {
        setOtpVerified(true);
        setOtpError('');
      } else {
        setOtpError(result.message);
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

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

        // Check Aadhaar verification for hospital and admin roles
        if ((role === 'hospital' || role === 'admin') && !otpVerified) {
          setError('Please verify your Aadhaar number before creating an account');
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
          // Account created successfully - for mock auth, auto-login
          if (data?.user?.id?.startsWith('mock')) {
            setSuccess(`Account created successfully! Welcome, ${fullName}!`);
            setTimeout(() => {
              // Redirect based on role
              const roleRedirects = {
                user: '/home-dashboard',
                hospital: '/hospital-dashboard',
                admin: '/admin-dashboard'
              };
              const redirectTo = roleRedirects[role] || '/home-dashboard';
              navigate(redirectTo, { replace: true });
            }, 1500);
          } else {
            // Real Supabase signup - email verification required
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
            // Clear Aadhaar states
            setAadhaar('');
            setAadhaarValid(null);
            setOtp('');
            setOtpId(null);
            setOtpSent(false);
            setOtpVerified(false);
            setOtpError('');
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
          setShake(true);
          setTimeout(() => setShake(false), 500);
        } else {
          // Success feedback before redirect based on role
          setTimeout(() => {
            // Redirect based on user role
            const roleRedirects = {
              user: '/home-dashboard',
              hospital: '/hospital-dashboard',
              admin: '/admin-dashboard'
            };
            const redirectTo = roleRedirects[userProfile?.role] || '/home-dashboard';
            navigate(redirectTo, { replace: true });
          }, 1000);
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
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-red-50 px-4 relative overflow-hidden"
      >
        {/* Subtle background elements - kept minimal to not interfere with UI */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Minimal floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-300 rounded-full opacity-10"
            style={{
              left: `${25 + i * 20}%`,
              top: `${35 + i * 15}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
          />
        ))}

        <div className="max-w-md w-full relative z-10">
          <motion.div
            ref={cardRef}
            className={`bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 overflow-hidden ${shake ? 'animate-shake' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={cardControls}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="text-center mb-10 relative">
              {/* Enhanced logo with heartbeat effect */}
              <motion.div
                className="relative mx-auto mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.3, type: 'spring', stiffness: 150 }}
              >
                <motion.div
                  className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-xl relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 10px 25px -5px rgba(239, 68, 68, 0.3)',
                      '0 20px 40px -10px rgba(239, 68, 68, 0.5)',
                      '0 10px 25px -5px rgba(239, 68, 68, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <Icon name="Heart" size={48} className="text-red-600" />
                  </motion.div>

                  {/* Pulsing rings - contained within the rounded container */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-300"
                    animate={{
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-red-200"
                    animate={{
                      opacity: [0.4, 0, 0.4]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: 0.5
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Dynamic title with typewriter effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-3"
              >
                <motion.h1
                  className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-blue-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </motion.h1>
              </motion.div>

              <motion.p
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                {isSignUp
                  ? 'Join the life-saving mission'
                  : 'Access your emergency dashboard'
                }
              </motion.p>

              {/* Trust indicators */}
              <motion.div
                className="flex justify-center items-center gap-4 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <motion.div
                  className="flex items-center gap-1 text-sm text-green-600"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon name="Shield" size={14} />
                  <span>Secure</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-1 text-sm text-blue-600"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Icon name="CheckCircle" size={14} />
                  <span>Verified</span>
                </motion.div>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
              >
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
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
              >
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
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                {!isSignUp && (
                  <motion.div
                    className="mt-1 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    <motion.button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 underline"
                      onClick={() => alert("Forgot Password functionality not implemented yet")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Forgot Password?
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
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
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
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
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Select
                        id="role"
                        label="Account Type"
                        value={role}
                        onChange={(value) => {
                          setRole(value);
                          // Reset Aadhaar and OTP when role changes
                          setAadhaar('');
                          setAadhaarValid(null);
                          setOtp('');
                          setOtpId(null);
                          setOtpSent(false);
                          setOtpVerified(false);
                          setOtpError('');
                        }}
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
                    </motion.div>

                  {/* Aadhaar Card Number - Only for Hospital and Admin */}
                  {(role === 'hospital' || role === 'admin') && (
                    <div className="space-y-4">
                      <Input
                        id="aadhaar"
                        type="text"
                        label="Aadhaar Card Number"
                        placeholder="XXXX-XXXX-XXXX"
                        value={aadhaar}
                        onChange={handleAadhaarChange}
                        isValid={aadhaarValid}
                        helperText="Enter 12-digit Aadhaar number"
                        required
                        disabled={isSubmitting}
                        maxLength={14} // Allow for dashes
                      />

                      {aadhaarValid && !otpSent && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendOTP}
                          disabled={otpLoading}
                          className="w-full"
                        >
                          {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                      )}

                      {otpSent && !otpVerified && (
                        <div className="space-y-3">
                          <Input
                            id="otp"
                            type="text"
                            label="Enter OTP"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            disabled={isSubmitting || otpLoading}
                            maxLength={6}
                          />

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleVerifyOTP}
                              disabled={otpLoading || otp.length !== 6}
                              className="flex-1"
                            >
                              {otpLoading ? 'Verifying...' : 'Verify OTP'}
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={handleSendOTP}
                              disabled={otpLoading}
                              className="text-sm"
                            >
                              Resend
                            </Button>
                          </div>
                        </div>
                      )}

                      {otpVerified && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Icon name="CheckCircle" size={16} className="text-green-600" />
                            <p className="text-sm text-green-800">Aadhaar verified successfully</p>
                          </div>
                        </div>
                      )}

                      {otpError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800">{otpError}</p>
                        </div>
                      )}
                    </div>
                  )}
                  </motion.div>
                )}
              </AnimatePresence>

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
                disabled={isSubmitting || ((role === 'hospital' || role === 'admin') && !otpVerified)}
                iconName={isSubmitting ? "Loader2" : undefined}
                iconPosition="left"
              >
                {isSubmitting
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>
            </form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <motion.button
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
                  // Reset Aadhaar states
                  setAadhaar('');
                  setAadhaarValid(null);
                  setOtp('');
                  setOtpId(null);
                  setOtpSent(false);
                  setOtpVerified(false);
                  setOtpError('');
                }}
                className="text-sm"
                disabled={isSubmitting}
              >
                {isSignUp ? (
                  <>
                    <span className="text-gray-600">Already have an account? </span>
                    <span className="text-blue-500 hover:text-blue-600 transition-colors duration-200">Sign in</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600">Don't have an account? </span>
                    <span className="text-blue-500 hover:text-blue-600 transition-colors duration-200">Sign up</span>
                  </>
                )}
              </motion.button>
            </motion.div>

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
