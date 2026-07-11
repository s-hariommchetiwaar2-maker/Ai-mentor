import React from 'react';
import {
  Button,
  Input,
  Card,
  Spinner,
  BaseLayout,
  ErrorPage,
} from '@ai-mentor/shared-ui';
import { AuthService, db, verifyToken } from '@ai-mentor/core';

// -----------------------------------------------------------------------------
// Interfaces for AI Mentor Features
// -----------------------------------------------------------------------------
interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  isFavorite: boolean;
  messages: ChatMessage[];
  createdAt: string;
}

interface ProjectFile {
  id: string;
  name: string;
  size: string;
  lastModified: string;
}

interface UserProject {
  id: string;
  name: string;
  templateName?: string;
  files: ProjectFile[];
}

interface UserNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface UserBookmark {
  id: string;
  title: string;
  url: string;
  category: 'chat' | 'course' | 'file';
  createdAt: string;
}

export function WebApp() {
  // Navigation Flow State
  const [view, setView] = React.useState<
    'login' | 'signup' | 'forgot' | 'reset' | 'dashboard' | 'error'
  >('login');

  // Dashboard Sub-navigation State
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'chat' | 'workspace' | 'courses' | 'notes' | 'bookmarks'
  >('overview');

  // Theme support state ('light' | 'dark')
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  // Search input query
  const [searchQuery, setSearchQuery] = React.useState('');

  // Notifications system state
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<
    { id: string; text: string; unread: boolean }[]
  >([
    {
      id: '1',
      text: 'AI Mentor verified your python syntax homework.',
      unread: true,
    },
    {
      id: '2',
      text: 'New model checkpoint "Claude-3.5" is now available.',
      unread: true,
    },
    {
      id: '3',
      text: 'System update: Responsive canvas workspace loaded.',
      unread: false,
    },
  ]);

  // Auth Forms states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState<'student' | 'mentor' | 'admin'>(
    'student'
  );
  const [rememberMe, setRememberMe] = React.useState(false);

  const [resetToken, setResetToken] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  // API loading & notifications state
  const [isLoading, setIsLoading] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Current session user
  const [currentUser, setCurrentUser] = React.useState<{
    id: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    fullName: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // AI Chat, Workspace, Notes, Bookmarks Core Application States
  // ---------------------------------------------------------------------------
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>([
    {
      id: 'c1',
      title: 'Rust Lifetimes Explainer',
      isFavorite: true,
      messages: [
        {
          id: 'm1',
          sender: 'user',
          content: 'Explain Rust lifetime annotations in struct definitions.',
          timestamp: '10:15 AM',
        },
        {
          id: 'm2',
          sender: 'assistant',
          content:
            "In Rust, a lifetime annotation like `struct User<'a>` ensures that any reference held inside the struct does not outlive the struct itself.",
          timestamp: '10:16 AM',
        },
      ],
      createdAt: 'Today, 10:15 AM',
    },
    {
      id: 'c2',
      title: 'Prompt Optimization Tips',
      isFavorite: false,
      messages: [
        {
          id: 'm3',
          sender: 'user',
          content: 'What are some techniques for prompt compression?',
          timestamp: 'Yesterday',
        },
        {
          id: 'm4',
          sender: 'assistant',
          content:
            'You can compress prompts by omitting filler words, utilizing semantic JSON keys, and leveraging fine-tuned instruction prefixes.',
          timestamp: 'Yesterday',
        },
      ],
      createdAt: 'Yesterday',
    },
  ]);
  const [activeChatId, setActiveTabChatId] = React.useState<string>('c1');
  const [chatInputMessage, setChatInputMessage] = React.useState('');

  const [projects] = React.useState<UserProject[]>([
    {
      id: 'p1',
      name: 'Neural Network Sandbox',
      templateName: 'PyTorch Starter',
      files: [
        {
          id: 'f1',
          name: 'train.py',
          size: '4.2 KB',
          lastModified: '3 hrs ago',
        },
        {
          id: 'f2',
          name: 'model.py',
          size: '12.1 KB',
          lastModified: '1 day ago',
        },
        {
          id: 'f3',
          name: 'dataset.json',
          size: '42.8 KB',
          lastModified: '3 mins ago',
        },
      ],
    },
    {
      id: 'p2',
      name: 'Custom Plugin SDK Wrapper',
      templateName: 'TypeScript Boilerplate',
      files: [
        {
          id: 'f4',
          name: 'index.ts',
          size: '2.5 KB',
          lastModified: '2 days ago',
        },
        {
          id: 'f5',
          name: 'package.json',
          size: '780 B',
          lastModified: '2 days ago',
        },
      ],
    },
  ]);
  const [selectedProjectId, setSelectedProjectId] =
    React.useState<string>('p1');

  const [notes, setNotes] = React.useState<UserNote[]>([
    {
      id: 'n1',
      title: 'Gradient Descent Notes',
      content:
        'SGD updates parameters by calculating gradients on small mini-batches of size 32-128. Adam combines this with momentum.',
      createdAt: 'Today, 9:00 AM',
    },
    {
      id: 'n2',
      title: 'Kubernetes Ingress Reminders',
      content:
        "Don't forget to specify rules with hosts and path matching configurations inside your spec YAML file.",
      createdAt: 'Yesterday',
    },
  ]);
  const [newNoteTitle, setNewNoteTitle] = React.useState('');
  const [newNoteContent, setNewNoteContent] = React.useState('');

  const [bookmarks, setBookmarks] = React.useState<UserBookmark[]>([
    {
      id: 'b1',
      title: 'Advanced Prompting Guide',
      url: '#chat-prompt-optimization',
      category: 'chat',
      createdAt: '3 days ago',
    },
    {
      id: 'b2',
      title: 'Model Routing Source Code',
      url: '#file-index-ts',
      category: 'file',
      createdAt: 'Yesterday',
    },
  ]);

  // Learning progress statistics
  const learningProgress = {
    overallProgress: 68,
    hoursCompleted: 32,
    activeLessons: 4,
    skillsUnlocked: 12,
  };

  // Sample course boards
  const sampleCourses = [
    {
      id: 'cr1',
      name: 'Introduction to Transformers',
      tutor: 'Claude Mentor',
      progress: 85,
      lessons: 12,
    },
    {
      id: 'cr2',
      name: 'Vector Databases in Production',
      tutor: 'Llama Specialist',
      progress: 40,
      lessons: 8,
    },
    {
      id: 'cr3',
      name: 'Advanced Prompt Engineering',
      tutor: 'GPT Specialist',
      progress: 95,
      lessons: 6,
    },
  ];

  // Load existing persistent session (Remember Me / Session Management) on mount
  React.useEffect(() => {
    const savedToken =
      localStorage.getItem('ai_mentor_session_token') ||
      sessionStorage.getItem('ai_mentor_session_token');
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
            fullName: profile.fullName,
          });
          setView('dashboard');
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

    if (password.length < 6) {
      setNotification({
        type: 'error',
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);
    setNotification(null);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const res = AuthService.signUp(email, password, fullName, role);
    setIsLoading(false);

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
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
      setNotification({
        type: 'error',
        message: 'Please specify both email and password.',
      });
      return;
    }

    setIsLoading(true);
    setNotification(null);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const res = AuthService.login(email, password, rememberMe);
    setIsLoading(false);

    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setNotification({ type: 'success', message: res.message });

      if (rememberMe) {
        localStorage.setItem('ai_mentor_session_token', res.token);
      } else {
        sessionStorage.setItem('ai_mentor_session_token', res.token);
      }

      setView('dashboard');
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
    await new Promise((resolve) => setTimeout(resolve, 300));

    const res = AuthService.forgotPassword(email);
    setIsLoading(false);

    setNotification({ type: 'success', message: res.message });

    const user = db.findUserByEmail(email);
    if (user && user.resetToken) {
      setResetToken(user.resetToken);
    }

    setView('reset');
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      setNotification({
        type: 'error',
        message: 'Token and new password are required.',
      });
      return;
    }

    if (newPassword.length < 6) {
      setNotification({
        type: 'error',
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);
    setNotification(null);
    await new Promise((resolve) => setTimeout(resolve, 300));

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
    await new Promise((resolve) => setTimeout(resolve, 400));

    const res = AuthService.googleLoginPlaceholder();
    setIsLoading(false);

    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setNotification({ type: 'success', message: res.message });
      sessionStorage.setItem('ai_mentor_session_token', res.token);
      setView('dashboard');
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

  // ---------------------------------------------------------------------------
  // Dashboard Action Handlers
  // ---------------------------------------------------------------------------
  const handleAddNewChat = () => {
    const newChatId = 'c-' + Math.random().toString(36).substring(2, 9);
    const newSession: ChatSession = {
      id: newChatId,
      title: 'New AI Chat Session',
      isFavorite: false,
      messages: [
        {
          id: 'm-init',
          sender: 'assistant',
          content:
            'Hello! I am your AI Mentor OS companion. Ask me anything about programming, databases, or project design.',
          timestamp: 'Just now',
        },
      ],
      createdAt: 'Just now',
    };
    setChatSessions([newSession, ...chatSessions]);
    setActiveTabChatId(newChatId);
    setActiveTab('chat');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputMessage.trim()) return;

    const updated = chatSessions.map((session) => {
      if (session.id === activeChatId) {
        const userMsg: ChatMessage = {
          id: 'm-' + Math.random().toString(36).substring(2, 9),
          sender: 'user',
          content: chatInputMessage,
          timestamp: 'Just now',
        };
        const assistantMsg: ChatMessage = {
          id: 'm-' + Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          content: `I received your prompt: "${chatInputMessage}". Let's explore how we can optimize your implementation of this concept.`,
          timestamp: 'Just now',
        };
        return {
          ...session,
          messages: [...session.messages, userMsg, assistantMsg],
        };
      }
      return session;
    });

    setChatSessions(updated);
    setChatInputMessage('');
  };

  const handleToggleFavoriteChat = (id: string) => {
    setChatSessions(
      chatSessions.map((session) =>
        session.id === id
          ? { ...session, isFavorite: !session.isFavorite }
          : session
      )
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const note: UserNote = {
      id: 'n-' + Math.random().toString(36).substring(2, 9),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: 'Just now',
    };
    setNotes([note, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleToggleBookmark = (
    title: string,
    url: string,
    category: 'chat' | 'course' | 'file'
  ) => {
    const exists = bookmarks.find((b) => b.url === url);
    if (exists) {
      setBookmarks(bookmarks.filter((b) => b.url !== url));
    } else {
      const bookmark: UserBookmark = {
        id: 'b-' + Math.random().toString(36).substring(2, 9),
        title,
        url,
        category,
        createdAt: 'Just now',
      };
      setBookmarks([bookmark, ...bookmarks]);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Filter sessions, projects, bookmarks based on search query
  const filteredChatSessions = chatSessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'error') {
    return <ErrorPage onReset={() => setView('login')} />;
  }

  // Header options depending on logged-in status
  const navLinks = currentUser
    ? [
        { label: 'My Dashboard', href: '#dashboard' },
        { label: 'Support Docs', href: '#docs' },
      ]
    : [
        { label: 'Login', href: '#login' },
        { label: 'Sign Up', href: '#signup' },
      ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      className={
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100 min-h-screen'
          : 'bg-gray-50 text-gray-900 min-h-screen'
      }
    >
      {/* -------------------------------------------------------------------
          GUEST VIEWS (Login, SignUp, Password Reset)
         ------------------------------------------------------------------- */}
      {view !== 'dashboard' ? (
        <BaseLayout brandName="AI Mentor OS" links={navLinks}>
          <div className="max-w-md mx-auto mt-8">
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

            {isLoading && (
              <div className="flex justify-center my-6">
                <Spinner size="md" color="blue" />
              </div>
            )}

            {view === 'login' && (
              <Card
                title="Welcome Back"
                subtitle="Please login to access your interactive AI workspace"
              >
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
                      onClick={() => {
                        setView('forgot');
                        setNotification(null);
                      }}
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
                    <span className="flex-shrink mx-4 text-gray-400 text-xs">
                      Or continue with
                    </span>
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
                      onClick={() => {
                        setView('signup');
                        setNotification(null);
                      }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              </Card>
            )}

            {view === 'signup' && (
              <Card
                title="Create Account"
                subtitle="Get access to smart personalized mentorship curricula"
              >
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
                    <label className="text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(
                          e.target.value as 'student' | 'mentor' | 'admin'
                        )
                      }
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
                      onClick={() => {
                        setView('login');
                        setNotification(null);
                      }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              </Card>
            )}

            {view === 'forgot' && (
              <Card
                title="Forgot Password"
                subtitle="Recover your account password easily"
              >
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
                    onClick={() => {
                      setView('login');
                      setNotification(null);
                    }}
                    className="text-blue-600 hover:underline text-sm font-semibold w-full text-center mt-2"
                  >
                    Back to Sign In
                  </button>
                </form>
              </Card>
            )}

            {view === 'reset' && (
              <Card
                title="Reset Password"
                subtitle="Choose a strong, secure new password"
              >
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
          </div>
        </BaseLayout>
      ) : (
        /* -------------------------------------------------------------------
            DASHBOARD VIEW
           ------------------------------------------------------------------- */
        <div className="flex h-screen overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col border-r border-gray-800">
            <div className="p-5 flex items-center justify-between border-b border-gray-800">
              <span className="font-extrabold text-xl text-blue-400 tracking-tight">
                AI Mentor OS
              </span>
            </div>

            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>📊 Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>💬 Interactive AI Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('workspace')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                  activeTab === 'workspace'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>📁 Project Workspace</span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                  activeTab === 'courses'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>🎓 Learning & Courses</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                  activeTab === 'notes'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>📝 My Personal Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                  activeTab === 'bookmarks'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>🔖 Saved Bookmarks</span>
              </button>
            </nav>

            {/* SIDEBAR FOOTER (USER SECTION) */}
            <div className="p-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 text-sm">
                  {currentUser
                    ? currentUser.fullName.substring(0, 2).toUpperCase()
                    : 'AI'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">
                    {currentUser?.fullName}
                  </p>
                  <span className="text-xs text-blue-400 capitalize font-medium">
                    {currentUser?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-1.5 rounded"
                title="Sign Out"
              >
                🚪
              </button>
            </div>
          </aside>

          {/* MAIN DYNAMIC CONTENT SCREEN */}
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* TOP NAVIGATION BAR */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shrink-0">
              {/* Search Bar */}
              <div className="w-80 relative">
                <input
                  type="text"
                  placeholder="Search chats, projects, files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-1.5 pl-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
                <span className="absolute left-3.5 top-2 text-gray-400 text-sm">
                  🔍
                </span>
              </div>

              {/* Utility Tools (Theme settings, Notification System, Profile Info) */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-lg"
                  title="Toggle Theme"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {/* Notifications Center */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-lg relative"
                    title="Notifications"
                  >
                    <span>🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-xl z-50 p-4 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                          Notifications
                        </span>
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-600 hover:underline font-semibold"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded text-xs leading-relaxed ${n.unread ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-800/40'}`}
                          >
                            {n.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User quick profile action */}
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {currentUser?.fullName}
                  </span>
                </div>
              </div>
            </header>

            {/* SCROLLABLE MAIN SCREEN */}
            <main className="flex-grow overflow-y-auto p-6">
              {/* -----------------------------------------------------------------
                  SUBTAB: OVERVIEW (Dashboard Widgets)
                 ----------------------------------------------------------------- */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Welcome to AI Mentor Dashboard
                    </h2>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddNewChat}
                    >
                      🚀 Quick New Chat
                    </Button>
                  </div>

                  {/* Dashboard top summary widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl shadow-sm text-center">
                      <span className="text-3xl">📈</span>
                      <h4 className="text-sm font-semibold text-gray-500 mt-2">
                        Overall Progress
                      </h4>
                      <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        {learningProgress.overallProgress}%
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl shadow-sm text-center">
                      <span className="text-3xl">⏱️</span>
                      <h4 className="text-sm font-semibold text-gray-500 mt-2">
                        Hours Completed
                      </h4>
                      <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-1">
                        {learningProgress.hoursCompleted} hours
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-xl shadow-sm text-center">
                      <span className="text-3xl">💡</span>
                      <h4 className="text-sm font-semibold text-gray-500 mt-2">
                        Active Courses
                      </h4>
                      <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                        {learningProgress.activeLessons}
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-xl shadow-sm text-center">
                      <span className="text-3xl">🔑</span>
                      <h4 className="text-sm font-semibold text-gray-500 mt-2">
                        Skills Unlocked
                      </h4>
                      <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">
                        {learningProgress.skillsUnlocked}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard center widgets layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent activity log */}
                    <Card
                      title="Recent Activity"
                      subtitle="Real-time timeline of your educational tasks"
                    >
                      <div className="space-y-3 mt-2">
                        <div className="flex items-start space-x-3 text-sm">
                          <span className="text-green-500">✓</span>
                          <div>
                            <p className="font-semibold">
                              Completed lesson 'Attention Mechanisms'
                            </p>
                            <span className="text-xs text-gray-400">
                              10 mins ago
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 text-sm">
                          <span className="text-blue-500">💬</span>
                          <div>
                            <p className="font-semibold">
                              Started conversation 'Rust Lifetimes Explainer'
                            </p>
                            <span className="text-xs text-gray-400">
                              2 hrs ago
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 text-sm">
                          <span className="text-orange-500">📁</span>
                          <div>
                            <p className="font-semibold">
                              Updated train.py in 'Neural Network Sandbox'
                            </p>
                            <span className="text-xs text-gray-400">
                              3 hrs ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Quick active course review */}
                    <Card
                      title="My Courses"
                      subtitle="Resume your registered educational boards"
                    >
                      <div className="space-y-4 mt-2">
                        {sampleCourses.map((course) => (
                          <div
                            key={course.id}
                            className="border-b last:border-b-0 dark:border-gray-800 pb-3 last:pb-0"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm">
                                {course.name}
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                {course.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  SUBTAB: AI CHAT (New Chat, Favorite, History)
                 ------------------------------------------------------------------- */}
              {activeTab === 'chat' && (
                <div className="flex h-full min-h-[500px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  {/* Left Column: Chat History & Favorite lists */}
                  <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <Button
                        onClick={handleAddNewChat}
                        variant="primary"
                        className="w-full text-xs py-2"
                      >
                        ＋ New Chat Session
                      </Button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                      {/* Favorites list */}
                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-gray-400 mb-2">
                          ⭐ Favorite Chats
                        </h4>
                        <div className="space-y-1">
                          {filteredChatSessions
                            .filter((s) => s.isFavorite)
                            .map((session) => (
                              <button
                                key={session.id}
                                onClick={() => setActiveTabChatId(session.id)}
                                className={`w-full text-left px-3 py-2 rounded text-xs font-semibold truncate transition-colors flex items-center justify-between ${
                                  activeChatId === session.id
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                              >
                                <span>{session.title}</span>
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavoriteChat(session.id);
                                  }}
                                  className="cursor-pointer"
                                >
                                  ★
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Recent chats history list */}
                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-gray-400 mb-2">
                          🕒 Chat History
                        </h4>
                        <div className="space-y-1">
                          {filteredChatSessions.map((session) => (
                            <button
                              key={session.id}
                              onClick={() => setActiveTabChatId(session.id)}
                              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold truncate transition-colors flex items-center justify-between ${
                                activeChatId === session.id
                                  ? 'bg-blue-600 text-white'
                                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                              }`}
                            >
                              <span>{session.title}</span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavoriteChat(session.id);
                                }}
                                className="cursor-pointer"
                              >
                                {session.isFavorite ? '★' : '☆'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Chat Conversations stream */}
                  <div className="flex-grow flex flex-col">
                    {activeChatId ? (
                      (() => {
                        const session = chatSessions.find(
                          (s) => s.id === activeChatId
                        );
                        if (!session)
                          return (
                            <p className="text-center text-gray-400 my-auto">
                              Select a chat to begin.
                            </p>
                          );

                        return (
                          <>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                              <div>
                                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                                  {session.title}
                                </h3>
                                <span className="text-xs text-gray-400">
                                  Session created {session.createdAt}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  handleToggleBookmark(
                                    session.title,
                                    `#chat-${session.id}`,
                                    'chat'
                                  )
                                }
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded text-xs font-semibold"
                              >
                                {bookmarks.find(
                                  (b) => b.url === `#chat-${session.id}`
                                )
                                  ? '🔖 Bookmarked'
                                  : '🔖 Bookmark Session'}
                              </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                              {session.messages.map((m) => (
                                <div
                                  key={m.id}
                                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`p-3 rounded-lg text-sm max-w-lg leading-relaxed ${
                                      m.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                    }`}
                                  >
                                    <p>{m.content}</p>
                                    <span className="text-[10px] block text-right mt-1 opacity-60">
                                      {m.timestamp}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <form
                              onSubmit={handleSendChatMessage}
                              className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2"
                            >
                              <input
                                type="text"
                                placeholder="Type your programming or coding query..."
                                value={chatInputMessage}
                                onChange={(e) =>
                                  setChatInputMessage(e.target.value)
                                }
                                className="flex-grow px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                              />
                              <Button type="submit" variant="primary">
                                Send
                              </Button>
                            </form>
                          </>
                        );
                      })()
                    ) : (
                      <p className="text-center text-gray-400 my-auto">
                        Select a chat to begin.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  SUBTAB: PROJECT WORKSPACE (My Projects, templates, files)
                 ------------------------------------------------------------------- */}
              {activeTab === 'workspace' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Workspace Editor
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        ＋ Import Project
                      </Button>
                      <Button variant="primary" size="sm">
                        ＋ New Sandbox
                      </Button>
                    </div>
                  </div>

                  {/* Projects layout split */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Projects directories */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold uppercase text-gray-400">
                        My Projects
                      </h4>
                      {filteredProjects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => setSelectedProjectId(proj.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                            selectedProjectId === proj.id
                              ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-700'
                              : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <h4 className="font-bold text-sm">{proj.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            Template: {proj.templateName}
                          </p>
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full mt-2 inline-block font-semibold">
                            {proj.files.length} Files
                          </span>
                        </div>
                      ))}

                      {/* Ready-to-use template cards */}
                      <h4 className="text-xs font-extrabold uppercase text-gray-400 pt-2">
                        Recommended Templates
                      </h4>
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Next.js API Engine</span>
                          <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                            Use
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          Ready configured API proxy workspace with vector
                          routes.
                        </p>
                      </div>
                    </div>

                    {/* Right Columns: Active project files */}
                    <div className="md:col-span-2">
                      {(() => {
                        const proj = projects.find(
                          (p) => p.id === selectedProjectId
                        );
                        if (!proj)
                          return (
                            <p className="text-center text-gray-400 py-10">
                              Select a project to explore files.
                            </p>
                          );

                        return (
                          <Card
                            title={proj.name}
                            subtitle={`Files inside ${proj.templateName}`}
                          >
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
                                <thead>
                                  <tr className="border-b dark:border-gray-800 text-gray-400 text-xs uppercase">
                                    <th className="py-2">File Name</th>
                                    <th className="py-2">Size</th>
                                    <th className="py-2">Last Modified</th>
                                    <th className="py-2 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {proj.files.map((file) => (
                                    <tr
                                      key={file.id}
                                      className="border-b dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <td className="py-3 font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                                        <span>📄</span>
                                        <span>{file.name}</span>
                                      </td>
                                      <td className="py-3">{file.size}</td>
                                      <td className="py-3">
                                        {file.lastModified}
                                      </td>
                                      <td className="py-3 text-right space-x-2">
                                        <button
                                          onClick={() =>
                                            handleToggleBookmark(
                                              file.name,
                                              `#file-${file.id}`,
                                              'file'
                                            )
                                          }
                                          className="text-xs hover:underline text-blue-600 dark:text-blue-400 font-bold"
                                        >
                                          {bookmarks.find(
                                            (b) => b.url === `#file-${file.id}`
                                          )
                                            ? '★ Unsave'
                                            : '★ Bookmark'}
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Card>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  SUBTAB: LEARNING & COURSES (Interactive boards)
                 ------------------------------------------------------------------- */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Learning Progress & Curricula
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sampleCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="p-5 flex-grow">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            Verified Curriculum
                          </span>
                          <h3 className="font-extrabold text-lg mt-3 text-gray-900 dark:text-gray-100">
                            {course.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Instructor: {course.tutor}
                          </p>

                          <div className="flex justify-between text-xs text-gray-500 mt-4 mb-1">
                            <span>Syllabus Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-green-500 h-full rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border-t dark:border-gray-800 flex justify-between items-center shrink-0">
                          <span className="text-xs font-semibold text-gray-500">
                            {course.lessons} interactive lessons
                          </span>
                          <Button variant="primary" size="sm">
                            Resume
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  SUBTAB: NOTES (Notebook taking, creation, filters)
                 ------------------------------------------------------------------- */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Interactive Notebook
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add note card */}
                    <div className="md:col-span-1">
                      <Card
                        title="Write New Note"
                        subtitle="Save crucial programming references instantly"
                      >
                        <form onSubmit={handleAddNote} className="space-y-4">
                          <Input
                            label="Note Title"
                            placeholder="e.g. PyTorch Learning Rates"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            required
                          />
                          <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Content
                            </label>
                            <textarea
                              rows={4}
                              placeholder="Write key code explanations, tips, or prompts here..."
                              value={newNoteContent}
                              onChange={(e) =>
                                setNewNoteContent(e.target.value)
                              }
                              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                          >
                            💾 Save Note
                          </Button>
                        </form>
                      </Card>
                    </div>

                    {/* Notes listing */}
                    <div className="md:col-span-2 space-y-4">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-5 bg-white border dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-sm space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                              {note.title}
                            </h3>
                            <span className="text-xs text-gray-400">
                              {note.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  SUBTAB: BOOKMARKS (List category filters)
                 ------------------------------------------------------------------- */}
              {activeTab === 'bookmarks' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Saved Bookmarks
                  </h2>

                  <div className="bg-white border dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-sm p-6">
                    {filteredBookmarks.length > 0 ? (
                      <div className="space-y-4">
                        {filteredBookmarks.map((bookmark) => (
                          <div
                            key={bookmark.id}
                            className="flex justify-between items-center border-b dark:border-gray-800 last:border-b-0 pb-3 last:pb-0"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-wider">
                                  {bookmark.category}
                                </span>
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                  {bookmark.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 block mt-1">
                                Bookmarked {bookmark.createdAt}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                setBookmarks(
                                  bookmarks.filter((b) => b.id !== bookmark.id)
                                )
                              }
                              className="text-xs text-red-500 hover:underline font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 py-10">
                        No bookmarks saved yet. Use the bookmark action in AI
                        chats or file lists to save links.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
export default WebApp;
