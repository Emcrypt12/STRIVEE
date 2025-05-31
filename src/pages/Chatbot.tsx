import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, PlusCircle, X, Menu } from 'lucide-react';
import { sendMessageToChatbot, Message } from '../services/api';
import toast from 'react-hot-toast';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

export default function Chatbot() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'New Conversation',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m Bob, your productivity assistant. How can I help you today?'
        }
      ],
      lastUpdated: new Date()
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>('1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = activeConversationId 
    ? conversations.find(c => c.id === activeConversationId) 
    : null;

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeConversationId) return;
    
    // Create user message
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    
    // Update conversation with user message
    updateConversation(activeConversationId, userMessage);
    setMessage('');
    setLoading(true);
    
    try {
      const isNewConversation = activeConversation?.messages.length === 1; // Only the initial greeting
      let currentContent = '';
      let newTitle: string | undefined;
      
      // Add an empty assistant message that we'll update
      const assistantMessage: Message = {
        role: 'assistant',
        content: ''
      };
      updateConversation(activeConversationId, assistantMessage, newTitle);
      
      await sendMessageToChatbot(
        [...activeConversation?.messages || [], userMessage],
        isNewConversation,
        (chunk) => {
          if (chunk.content) {
            currentContent += chunk.content;
            // Update only the last message's content
            setConversations(prev => prev.map(conv => {
              if (conv.id === activeConversationId) {
                const messages = [...conv.messages];
                messages[messages.length - 1] = {
                  ...messages[messages.length - 1],
                  content: currentContent
                };
                return {
                  ...conv,
                  messages,
                  title: newTitle || conv.title
                };
              }
              return conv;
            }));
          }
          if (chunk.title) {
            newTitle = chunk.title;
            // Update only the title
            setConversations(prev => prev.map(conv => {
              if (conv.id === activeConversationId) {
                return {
                  ...conv,
                  title: newTitle || conv.title
                };
              }
              return conv;
            }));
          }
        }
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from StriveBot. Please try again.');
      // Remove the empty assistant message if there was an error
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: conv.messages.filter(msg => msg.content !== '')
          };
        }
        return conv;
      }));
    } finally {
      setLoading(false);
    }
  };

  const updateConversation = (conversationId: string, newMessage: Message, newTitle?: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastUpdated: new Date(),
          title: newTitle || conv.title
        };
      }
      return conv;
    }));
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m StriveBot, your productivity assistant. How can I help you today?'
        }
      ],
      lastUpdated: new Date()
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (activeConversationId === id) {
      setActiveConversationId(conversations.length > 1 ? conversations[0].id : null);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r border-gray-200 bg-white overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Conversations</h2>
                <button 
                  onClick={createNewConversation}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                  title="New conversation"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No conversations yet</p>
                    <button 
                      onClick={createNewConversation}
                      className="mt-2 text-primary-600 hover:text-primary-700"
                    >
                      Start a new conversation
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {conversations.map(conversation => (
                      <div 
                        key={conversation.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          activeConversationId === conversation.id ? 'bg-primary-50' : ''
                        }`}
                        onClick={() => setActiveConversationId(conversation.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {conversation.messages.length > 0 
                                ? truncateText(conversation.messages[conversation.messages.length - 1].content, 40) 
                                : 'No messages yet'}
                            </p>
                          </div>
                          <div className="flex items-center ml-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(conversation.lastUpdated)}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conversation.id);
                              }}
                              className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 mr-2"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <h2 className="font-semibold text-gray-800">{activeConversation.title}</h2>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation?.messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div 
                          className="prose prose-sm max-w-none whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: message.content
                              .replace(/\n/g, '<br>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/^- (.*?)(?:\n|$)/gm, '<li class="ml-4 list-disc">$1</li>')
                              .replace(/^\d+\. (.*?)(?:\n|$)/gm, '<li class="ml-4 list-decimal">$1</li>')
                          }} 
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    className="bg-primary-600 text-white p-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a conversation or start a new one</p>
                <button
                  onClick={createNewConversation}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}