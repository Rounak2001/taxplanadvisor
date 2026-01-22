import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const BOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';
const USER_AVATAR = 'https://cdn-icons-png.flaticon.com/512/924/924874.png';

const Chat_app = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [user]);

  const [loginForm, setLoginForm] = useState({ name: '', phone: '' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [error, setError] = useState(null);

  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  const BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loginForm.name.trim() || !loginForm.phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (loginForm.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/onboard/`, loginForm);
      const { user_id, greeting, follow_ups } = res.data;

      setUser({ ...loginForm, user_id });
      setMessages([{
        sender: 'bot',
        text: greeting,
        timestamp: new Date()
      }]);
      setSuggestedQuestions(follow_ups || []);
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect. Please check your connection and try again.");
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !user || isLoading) return;

    const newMsg = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setSuggestedQuestions([]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${BASE_URL}/chat/`, {
        user_id: user.user_id,
        prompt: text.trim()
      });

      const botResponse = res.data.response || 'No response received';
      const newFollowUps = res.data.follow_ups || [];

      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);

      setSuggestedQuestions(Array.isArray(newFollowUps) ? newFollowUps.slice(0, 4) : []);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: '❌ Could not reach the server. Please try again.',
        timestamp: new Date()
      }]);
      setSuggestedQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!user || isLoading) return;

    const confirmClear = window.confirm("Clear chat history?");
    if (!confirmClear) return;

    setMessages([]);
    setSuggestedQuestions([]);

    try {
      await axios.post(`${BASE_URL}/chat/clear/`, { user_id: user.user_id });
      setMessages([{
        sender: 'bot',
        text: "✅ Chat history cleared. What would you like to know?",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Clear error:", error);
      setError("Failed to clear chat");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Login Form
  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-5 pt-20 relative z-10">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 rounded-2xl border border-border/50">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                  <img src={BOT_AVATAR} alt="AI" className="w-12 h-12" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  AI Tax Assistant
                </h1>
                <p className="text-sm text-muted-foreground">
                  Get instant answers to your tax queries
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-5">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                  required
                  autoFocus
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={loginForm.phone}
                  onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Start Chatting
                  <span>→</span>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  ⚡ Powered by AI • Instant responses
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Full Screen Chat Interface - No Navbar
  return (
    <div className="fixed inset-0 flex flex-col bg-background z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        {/* Left - Back + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Back to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <img src={BOT_AVATAR} alt="AI" className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">AI Tax Assistant</h1>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Right - User + Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs">👤</span>
            </div>
            <span className="text-xs text-foreground font-medium">{user.name}</span>
          </div>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Clear chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto" ref={chatWindowRef}>
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
          {/* Welcome State */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center mb-6">
                <img src={BOT_AVATAR} alt="AI" className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}! 👋</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                I'm your AI Tax Assistant. Ask me anything about Indian taxes, GST, ITR filing, deductions, and latest updates.
              </p>
              <div className="w-full max-w-2xl">
                <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-2">
                  <span>💡</span> Try asking:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'What is tax on ₹10L income?',
                    'Latest tax slab updates for 2025',
                    'Explain Section 80C deductions',
                    'How to file ITR-1 form?'
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-left px-4 py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-primary/30 text-sm text-foreground transition-all group"
                    >
                      <span className="group-hover:text-primary transition-colors">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%]`}>
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <img src={BOT_AVATAR} alt="AI" className="w-5 h-5" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-secondary/50 border border-border/50 text-foreground rounded-bl-sm'
                  }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:opacity-80 break-all inline-flex items-center gap-1"
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="pl-4 my-2 list-disc space-y-1" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="pl-4 my-2 list-decimal space-y-1" {...props} />
                      ),
                      code: ({ node, inline, ...props }) => (
                        inline
                          ? <code className={`px-1.5 py-0.5 rounded text-xs ${msg.sender === 'bot' ? 'bg-background/50' : 'bg-white/20'}`} {...props} />
                          : <code className="block p-3 my-2 rounded-lg bg-background/50 text-xs overflow-x-auto" {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="overflow-x-auto" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-foreground" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <img src={USER_AVATAR} alt="You" className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <img src={BOT_AVATAR} alt="AI" className="w-5 h-5" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-secondary/50 border border-border/50">
                  <div className="flex gap-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!isLoading && suggestedQuestions.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-2 px-1">
                <span>💡</span> Related questions you might ask:
              </p>
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-primary/30 text-sm text-foreground transition-all flex items-center justify-between gap-3 group"
                >
                  <span className="flex-1">{question}</span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/30 border border-border/50 focus-within:border-primary/50 transition-colors">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about taxes, GST, ITR, or anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send • AI responses may vary
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat_app;
