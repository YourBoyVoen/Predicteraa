import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Menu, ChevronRight } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { agentApi, ApiError } from "../services";
import { useConversations } from "../contexts/ConversationsContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  animate?: boolean; // Add animate flag
  source?: string; // AI source (e.g., 'Google Gemini AI')
}

// Typewriter animation component
const TypewriterText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ text, speed = 6, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [_isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsComplete(true);
      return;
    }

    setDisplayText('');
    setIsComplete(false);
    
    let index = 0;
    let isCancelled = false;

    const typeNextChar = () => {
      if (isCancelled) return;
      
      if (index < text.length) {
        setDisplayText(text.substring(0, index + 1));
        index++;
        setTimeout(typeNextChar, speed);
      } else {
        if (!isCancelled) {
          setIsComplete(true);
          onComplete?.();
        }
      }
    };

    // Start typing immediately
    typeNextChar();

    return () => {
      isCancelled = true;
    };
  }, [text, speed]);

  // Always render with markdown to show formatting during animation
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          // Custom styling for markdown elements
          p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside mb-3 last:mb-0 space-y-1 pl-6" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside mb-3 last:mb-0 space-y-1 pl-6" {...props} />,
          li: ({node, ...props}) => <li className="ml-0" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
          em: ({node, ...props}) => <em className="italic" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
          code: ({node, inline, ...props}: any) => 
            inline ? (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
            ),
        }}
      >
        {displayText}
      </ReactMarkdown>
    </div>
  );
};

const AgentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messageIdCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingNavigationRef = useRef<{ convId: number } | null>(null);

  const { conversations, refreshConversations } = useConversations();
  const { showSnackbar } = useSnackbar();

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const conversationId = params.get("conversation");
  const machineId = params.get("machineId");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation messages when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages(parseInt(conversationId));
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversationMessages = async (convId: number) => {
    try {
      const data = await agentApi.getConversationMessages(convId);
      setMessages(data.data.messages);
    } catch (err) {
      console.error('Failed to load conversation messages:', err);
      if (err instanceof ApiError && err.status === 401) {
        showSnackbar('Unauthorized access to this conversation', 'error');
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const wasEmpty = messages.length === 0;
    setIsLoading(true);

    // If starting from empty state, trigger layout transition first
    if (wasEmpty) {
      setIsTransitioning(true);
      // Wait for layout to render
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const tempUserMessage: Message = {
      id: ++messageIdCounter.current,
      role: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    // Scroll to ensure we're in the message view
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    const wasNewConversation = !conversationId;

    try {
      const data = await agentApi.sendMessage({
        message: userMessage,
        conversation_id: conversationId ? parseInt(conversationId) : undefined,
      });

      // Clear input only on successful send
      setInput("");

      // Always add minimum delay to prevent flickering
      await new Promise(resolve => setTimeout(resolve, 800));

      const assistantMessage: Message = {
        id: ++messageIdCounter.current,
        role: 'assistant',
        message: data.data.response,
        timestamp: new Date().toISOString(),
        animate: true, // Mark for animation
        source: data.data.sources?.[0] || 'AI' // Capture AI source
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTransitioning(false); // Clear transition state
      setIsLoading(false); // Clear loading when assistant message appears

      // If new conversation was created, store the navigation request
      // It will be executed when the typewriter animation completes
      if (wasNewConversation && data.data.conversation_id) {
        pendingNavigationRef.current = { convId: data.data.conversation_id };
      }

    } catch (err: unknown) {
      console.error("Chat error:", err);

      let errorMessage = "Failed to send message. Please try again.";
      if (err instanceof ApiError) {
        if (err.status === 404) {
          errorMessage = "Service not found. Please check your connection.";
        } else if (err.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.status === 429) {
          errorMessage = "AI service rate limit reached. Please try again later.";
        } else if (err.status) {
          errorMessage = `Request failed (${err.status}): ${err.message}`;
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Show error via snackbar
      showSnackbar(errorMessage, 'error');
      setMessages(prev => prev.slice(0, -1));
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    // When animation completes, execute any pending navigation
    if (pendingNavigationRef.current) {
      const { convId } = pendingNavigationRef.current;
      pendingNavigationRef.current = null;
      navigate(`/agent?conversation=${convId}`, { replace: true });
      refreshConversations();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentConversation = conversations.find(conv => String(conv.id) === conversationId);
  const hasMessages = messages.length > 0 || isTransitioning;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* LAYOUT: Empty State (centered) */}
        {!hasMessages && (
          <div className="flex-1 min-h-screen bg-gray-50 flex flex-col p-4 md:p-10">
            {/* Header with Breadcrumb - Sticky */}
            <div className="sticky top-0 bg-gray-50 z-10 mb-4 pb-2">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-2 rounded-lg border"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                <div>
                  {/* Breadcrumb */}
                  <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <button
                      onClick={() => navigate("/")}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </button>
                    <ChevronRight size={16} />
                    <span className="text-gray-900 font-medium">Agent</span>
                  </nav>
                </div>
              </div>
            </div>

            {/* Centered Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-4xl">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">
                  Ask PredictAgent Anything
                </h1>
                <p className="text-gray-600 mt-2">
                  Suggestions of what to ask our Agent
                </p>
              </div>

              {machineId && (
                <div className="mb-8 text-center">
                  <p className="text-blue-600 font-semibold text-sm">
                    You are asking about Machine #{machineId}
                  </p>
                </div>
              )}

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Suggestion text="What can I ask you to do?" onClick={handleSuggestionClick} />
                <Suggestion text="Which machines need attention?" onClick={handleSuggestionClick} />
                <Suggestion text="When was the last time a diagnostic was done?" onClick={handleSuggestionClick} />
              </div>

              {/* Input - Centered */}
              <div className="w-full bg-white border border-gray-200 shadow rounded-2xl flex items-center px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask me anything about your maintenance data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-xl hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Empty State Message */}
              {!isLoading && (
                <div className="mt-10 text-center text-gray-500 text-sm">
                  Start a conversation by asking a question above or typing your own message.
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {/* LAYOUT: With Messages (top header + scrollable messages + bottom input) */}
        {hasMessages && (
          <>
            {/* Header with Breadcrumb - Sticky */}
            <div className="sticky top-0 bg-gray-50 z-10 pt-6 md:pt-10 pb-4 px-4 md:px-10">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-2 rounded-lg border"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                <div>
                  {/* Breadcrumb with Conversation Title */}
                  <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <button
                      onClick={() => navigate("/")}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </button>
                    <ChevronRight size={16} />
                    <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate('/agent')}>
                      Agent
                    </span>
                    {conversationId && (
                      <>
                        <ChevronRight size={16} />
                        <span className="text-gray-900 font-medium">
                          {currentConversation?.title || 'New Conversation'}
                        </span>
                      </>
                    )}
                  </nav>
                  {machineId && (
                    <p className="text-blue-600 font-semibold text-xs mt-1">
                      Machine #{machineId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="px-6 pb-6 pt-32">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6 pb-32">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${
                        msg.role === 'user'
                          ? 'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-blue-500 text-white'
                          : 'max-w-full px-4 py-3 text-gray-800'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        ) : (
                          msg.animate ? (
                            <TypewriterText text={msg.message} onComplete={handleAnimationComplete} />
                          ) : (
                            <div className="markdown-content">
                              <ReactMarkdown
                                components={{
                                  // Custom styling for markdown elements
                                  p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc list-outside mb-3 last:mb-0 space-y-1 pl-6" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal list-outside mb-3 last:mb-0 space-y-1 pl-6" {...props} />,
                                  li: ({node, ...props}) => <li className="ml-0" {...props} />,
                                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                                  em: ({node, ...props}) => <em className="italic" {...props} />,
                                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                  h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                  code: ({node, inline, ...props}: any) => 
                                    inline ? (
                                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                    ) : (
                                      <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                                    ),
                                }}
                              >
                                {msg.message}
                              </ReactMarkdown>
                            </div>
                          )
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <p className={`text-xs ${
                            msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                          {msg.role === 'assistant' && msg.source && (
                            <div className="group relative">
                              <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-max max-w-xs">
                                <div className="bg-gray-900 text-white text-xs rounded-lg py-1.5 px-2.5 shadow-lg">
                                  {msg.source}
                                  <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Bottom Input Bar - Fixed */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-gray-50 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                {/* Suggestions above input */}
                <div className="flex flex-wrap justify-start gap-3 mb-4">
                  <Suggestion text="What can I ask you to do?" onClick={handleSuggestionClick} />
                  <Suggestion text="Which machines need attention?" onClick={handleSuggestionClick} />
                  <Suggestion text="When was the last time a diagnostic was done?" onClick={handleSuggestionClick} />
                </div>
                
                {/* Input - No border on container */}
                <div className="w-full bg-white shadow rounded-2xl flex items-center px-4 py-3">
                  <input
                    type="text"
                    placeholder="Ask me anything about your maintenance data..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-xl hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Suggestion = ({ text, onClick }: { text: string; onClick: (text: string) => void }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="px-4 py-2 bg-white rounded-xl text-gray-700 text-sm border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition shadow-sm"
    >
      {text}
    </button>
  );
};

export default AgentPage;