import React from 'react';
import { Button, Input, Card, Spinner, BaseLayout, ErrorPage } from '@ai-mentor/shared-ui';
import { AuthService, db, verifyToken } from '@ai-mentor/core';

export function WebApp() {
  // Navigation Flow State
  const [view, setView] = React.useState<'login' | 'signup' | 'forgot' | 'reset' | 'profile' | 'error'>('login');

  // Forms states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState<'student' | 'mentor' | 'admin'>('student');
  const [rememberMe, setRememberMe] = React.useState(false);

  const [resetToken, setResetToken] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  // API loading & notifications state
  const [isLoading, setIsLoading] = React.useState(false);
  const [notification, setNotification] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Current session
  const [currentUser, setCurrentUser] = React.useState<{
    id: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    fullName: string;
  } | null>(null);

  // Load existing persistent session (Remember Me / Session Management) on mount
  React.useEffect(() => {
    const savedToken = localStorage.getItem('ai_mentor_session_token') || sessionStorage.getItem('ai_mentor_session_token');
    if (savedToken) {
      const decoded = verifyToken(savedToken);
      if (decoded) {
        const user = db.findUserById(decoded.userId);
        const profile = db.findProfileByUserId(decoded.userId);
        if (user && profile) {
          setCurrentUser({
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: profile.fullName
          });
          setView('profile');
        }
      }
    }
  }, []);

  const clearForms = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setNewPassword('');
    setNotification(null);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setNotification({ type: 'error', message: 'All fields are required.' });
      return;
    }

    // Quick validation checks
    if (password.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);
    setNotification(null);

    // Simulate minor delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const res = AuthService.signUp(email, password, fullName, role);
    setIsLoading(false);

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      // Automatically verify the email in the simulated DB for convenience
      const user = db.findUserByEmail(email);
      if (user) {
        AuthService.verifyEmail(user.verificationToken!);
      }
      setView('login');
      clearForms();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setNotification({ type: 'error', message: 'Please specify both email and password.' });
      return;
    }

    setIsLoading(true);
    setNotification(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const res = AuthService.login(email, password, rememberMe);
    setIsLoading(false);

    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setNotification({ type: 'success', message: res.message });

      // Persist the token cryptographically
      if (rememberMe) {
        localStorage.setItem('ai_mentor_session_token', res.token);
      } else {
        sessionStorage.setItem('ai_mentor_session_token', res.token);
      }

      setView('profile');
      clearForms();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setNotification({ type: 'error', message: 'Email is required.' });
      return;
    }

    setIsLoading(true);
    setNotification(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const res = AuthService.forgotPassword(email);
    setIsLoading(false);

    setNotification({ type: 'success', message: res.message });

    // Extract token for automated simulation so user doesn't have to look in logs
    const user = db.findUserByEmail(email);
    if (user && user.resetToken) {
      setResetToken(user.resetToken);
    }

    setView('reset');
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      setNotification({ type: 'error', message: 'Token and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);
    setNotification(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const res = AuthService.resetPassword(resetToken, newPassword);
    setIsLoading(false);

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setView('login');
      clearForms();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleGoogleOAuthSimulate = async () => {
    setIsLoading(true);
    setNotification(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const res = AuthService.googleLoginPlaceholder();
    setIsLoading(false);

    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setNotification({ type: 'success', message: res.message });
      sessionStorage.setItem('ai_mentor_session_token', res.token);
      setView('profile');
      clearForms();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ai_mentor_session_token');
    sessionStorage.removeItem('ai_mentor_session_token');
    setNotification({ type: 'success', message: 'Successfully logged out.' });
    setView('login');
  };

  // Navigations Links
  const navLinks = currentUser
    ? [
        { label: 'Profile Dashboard', href: '#profile' },
        { label: 'Workspace', href: '#workspace' }
      ]
    : [
        { label: 'Login', href: '#login' },
        { label: 'Sign Up', href: '#signup' }
      ];

  if (view === 'error') {
    return <ErrorPage onReset={() => setView('login')} />;
  }

  return (
    <BaseLayout brandName="AI Mentor OS" links={navLinks}>
      <div className="max-w-md mx-auto mt-8">

        {/* Global Notification Alerts */}
        {notification && (
          <div
            className={`p-4 mb-6 rounded-md text-sm font-semibold transition-all shadow-sm ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* LOADING SPINNER OVERLAY */}
        {isLoading && (
          <div className="flex justify-center my-6">
            <Spinner size="md" color="blue" />
          </div>
        )}

        {/* -------------------------------------------------------------------
            LOGIN VIEW
           ------------------------------------------------------------------- */}
        {view === 'login' && (
          <Card title="Welcome Back" subtitle="Please login to access your interactive AI workspace">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setNotification(null); }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Sign In
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleGoogleOAuthSimulate}
                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Sign in with Google
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setView('signup'); setNotification(null); }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </Card>
        )}

        {/* -------------------------------------------------------------------
            SIGN UP VIEW
           ------------------------------------------------------------------- */}
        {view === 'signup' && (
          <Card title="Create Account" subtitle="Get access to smart personalized mentorship curricula">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Hariom Chetiwaar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password (min. 6 chars)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'mentor' | 'admin')}
                  className="px-3 py-2 border rounded-md shadow-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Register
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setView('login'); setNotification(null); }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign In
                </button>
              </p>
            </form>
          </Card>
        )}

        {/* -------------------------------------------------------------------
            FORGOT PASSWORD VIEW
           ------------------------------------------------------------------- */}
        {view === 'forgot' && (
          <Card title="Forgot Password" subtitle="Recover your account password easily">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" className="w-full">
                Send Recovery Link
              </Button>

              <button
                type="button"
                onClick={() => { setView('login'); setNotification(null); }}
                className="text-blue-600 hover:underline text-sm font-semibold w-full text-center mt-2"
              >
                Back to Sign In
              </button>
            </form>
          </Card>
        )}

        {/* -------------------------------------------------------------------
            RESET PASSWORD VIEW
           ------------------------------------------------------------------- */}
        {view === 'reset' && (
          <Card title="Reset Password" subtitle="Choose a strong, secure new password">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="Recovery Token"
                type="text"
                placeholder="Simulation token auto-filled"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" className="w-full">
                Update Password
              </Button>
            </form>
          </Card>
        )}

        {/* -------------------------------------------------------------------
            PROTECTED USER PROFILE VIEW (Role-Based Access Control)
           ------------------------------------------------------------------- */}
        {view === 'profile' && currentUser && (
          <div className="space-y-6">
            <Card title="User Account Settings" subtitle="Verify and manage your credentials">
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-500">Full Name</span>
                  <span className="font-bold text-gray-900">{currentUser.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-500">Email Address</span>
                  <span className="font-medium text-gray-900">{currentUser.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-500">Assigned Platform Role</span>
                  <span className="uppercase font-extrabold text-blue-600 tracking-wide text-xs bg-blue-50 px-2.5 py-1 rounded">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </Card>

            {/* Role-Based Panel Displays */}
            {currentUser.role === 'admin' && (
              <Card title="🔑 Administrative Panel" subtitle="Authorized access only">
                <p className="text-sm text-gray-700 mb-4">
                  Welcome to the Admin workspace. You have permissions to verify system telemetry, review mentor submissions, and edit schemas.
                </p>
                <div className="flex gap-2">
                  <Button variant="danger" size="sm">Purge Cache</Button>
                  <Button variant="secondary" size="sm">System Logs</Button>
                </div>
              </Card>
            )}

            {currentUser.role === 'mentor' && (
              <Card title="👨‍🏫 Mentor Board" subtitle="Guide students efficiently">
                <p className="text-sm text-gray-700 mb-4">
                  Review student projects, evaluate pending coding submissions, or update prompt models here.
                </p>
                <Button variant="primary" size="sm">Review Requests</Button>
              </Card>
            )}

            {currentUser.role === 'student' && (
              <Card title="🎓 Student Hub" subtitle="Your learning summary">
                <p className="text-sm text-gray-700 mb-4">
                  Continue learning. Complete your remaining modules to unlock custom AI mentor sessions.
                </p>
                <Button variant="primary" size="sm">Resume Curriculum</Button>
              </Card>
            )}

            <Button onClick={handleLogout} variant="secondary" className="w-full">
              Sign Out
            </Button>
          </div>
        )}

      </div>
    </BaseLayout>
  );
}
export default WebApp;
