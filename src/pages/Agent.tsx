import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { agentApi, ApiError, type Conversation } from "../services";
import { useConversations } from "../contexts/ConversationsContext";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

const AgentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, refreshConversations, deleteConversation: deleteConv } = useConversations();

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
        setError('Unauthorized access to this conversation');
      }
    }
  };

  const selectConversation = (convId: number) => {
    navigate(`/agent?conversation=${convId}`);
  };

  const startNewConversation = () => {
    navigate('/agent');
    setMessages([]);
  };

  const handleDeleteConversation = async (convId: number) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await deleteConv(convId);
      
      // If we're currently viewing the deleted conversation, navigate away
      if (conversationId === String(convId)) {
        navigate('/agent');
        setMessages([]);
      }
      
      // Conversations list is updated automatically by context
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      if (err instanceof ApiError) {
        setError(`Failed to delete conversation: ${err.message}`);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);

    const tempUserMessage: Message = {
      id: ++messageIdCounter.current,
      role: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    const wasNewConversation = !conversationId;

    try {
      const data = await agentApi.sendMessage({
        message: userMessage,
        conversation_id: conversationId ? parseInt(conversationId) : undefined,
      });

      const assistantMessage: Message = {
        id: ++messageIdCounter.current,
        role: 'assistant',
        message: data.data.response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // If new conversation was created, navigate to it
      if (wasNewConversation && data.data.conversation_id) {
        navigate(`/agent?conversation=${data.data.conversation_id}`, { replace: true });
        await refreshConversations(); // Refresh conversations list
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

      setError(errorMessage);
      setMessages(prev => prev.slice(0, -1));
      
      // Auto-clear error after 8 seconds for better visibility
      const timeoutId = setTimeout(() => {
        setError(null);
      }, 8000);
      
      // Store timeout ID to clear if component unmounts
      return () => clearTimeout(timeoutId);
    } finally {
      setIsLoading(false);
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
  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Menu & Conversations Button */}
        <div className="md:hidden fixed top-6 left-6 z-10 flex gap-2">
          <button
            className="p-2 bg-white shadow rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* LAYOUT: Empty State (centered) */}
        {!hasMessages && (
          <div className="flex-1 flex items-center justify-center px-6">
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
        )}

        {/* LAYOUT: With Messages (top header + scrollable messages + bottom input) */}
        {hasMessages && (
          <>
            {/* Header */}
            <div className="pt-24 md:pt-40 pb-6 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {currentConversation?.title || `Conversation ${conversationId}`}
                  </h1>
                  {machineId && (
                    <p className="text-blue-600 font-semibold text-sm mt-2">
                      You are asking about Machine #{machineId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
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
                          <div className="markdown-content">
                            <ReactMarkdown
                              components={{
                                // Custom styling for markdown elements
                                p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 last:mb-0 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 last:mb-0 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="ml-2" {...props} />,
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
                        )}
                        <p className={`text-xs mt-2 ${
                          msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
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

            {/* Bottom Bar - Fixed */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-gray-50 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                {/* Suggestions above input */}
                <div className="flex flex-wrap justify-start gap-3 mb-4">
                  <Suggestion text="What can I ask you to do?" onClick={handleSuggestionClick} />
                  <Suggestion text="Which machines need attention?" onClick={handleSuggestionClick} />
                  <Suggestion text="When was the last time a diagnostic was done?" onClick={handleSuggestionClick} />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg animate-fade-in">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-red-800 font-semibold text-sm">Error</p>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
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