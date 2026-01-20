import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }

        const { data, error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else if (data?.user && !data?.user?.email_confirmed_at) {
          setSuccess('Account created successfully! Please check your email to confirm your account before signing in.');
          setIsSignUp(false);
        } else {
          setSuccess('Account created successfully! You can now sign in.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
          <div className="bg-card border border-border rounded-xl shadow-elevation-lg p-8">
            <div className="text-center mb-8">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={isSubmitting}
                  />
                </div>
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
                className="w-full"
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

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Secure access to emergency blood allocation system
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
