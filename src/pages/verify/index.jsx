import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AppImage from '../../components/AppImage';
import Icon from '../../components/AppIcon';

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);

    // Auto-verify if both email and token are provided
    if (emailParam && tokenParam) {
      handleVerify(emailParam, tokenParam);
    }
  }, [searchParams]);

  const handleVerify = async (emailToVerify = email, tokenToVerify = token) => {
    if (!emailToVerify || !tokenToVerify) {
      setError('Email and verification token are required.');
      return;
    }

    setError('');
    setSuccess('');
    setShake(false);
    setIsSubmitting(true);

    try {
      const { error } = await verifyEmail(emailToVerify, tokenToVerify);
      if (error) {
        setError(error.message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        setSuccess('Email verified successfully! You can now sign in.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
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
        <title>Verify Email - SmartBloodAllocation</title>
        <meta name="description" content="Verify your email address for Smart Blood Allocation" />
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
                Verify Your Email
              </h1>
              <p className="text-muted-foreground">
                Enter your email and verification token to complete registration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email Address"
                floating
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />

              <Input
                id="token"
                type="text"
                label="Verification Token"
                floating
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter verification token"
                required
                disabled={isSubmitting}
              />

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
                variant={success ? "success" : "default"}
                size="lg"
                className={`w-full transition-transform duration-150 hover:scale-105 active:scale-95 ${success ? 'animate-pulse' : ''}`}
                disabled={isSubmitting}
                iconName={isSubmitting ? "Loader2" : success ? "Check" : undefined}
                iconPosition="left"
              >
                {isSubmitting
                  ? 'Verifying...'
                  : success
                  ? 'Success!'
                  : 'Verify Email'
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                Back to Login
              </button>
            </div>

            <div className="mt-4 text-center flex items-center justify-center space-x-2">
              <Icon name="Shield" size={16} className="text-primary" />
              <p className="text-sm text-muted-foreground">
                Secure email verification for Smart Blood Bank
              </p>
              <div className="relative group">
                <Icon name="Info" size={14} className="text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Verification tokens expire after 24 hours
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Verify;
