import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { sendMessageToAssistant, Message } from '../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface AiAssistantChatProps {
  initialMessage?: string;
}

export default function AiAssistantChat({ initialMessage = 'Hello! I\'m Bob, how can i help you today?' }: AiAssistantChatProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'assistant',
      content: initialMessage
    }
  ]);

  const sendMessage = async () => {
    if (!query.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: query
    };
    
    setConversation([...conversation, userMessage]);
    setQuery('');
    setLoading(true);
    
    try {
      // Add empty assistant message that will be updated
      setConversation(prev => [...prev, { role: 'assistant', content: '' }]);

      await sendMessageToAssistant([...conversation, userMessage], (chunk) => {
        setConversation(prev => {
          const newConversation = [...prev];
          const lastMessage = newConversation[newConversation.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = (lastMessage.content || '') + (chunk.content || '');
          }
          return newConversation;
        });
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from StriveBot. Please try again.');
      // Remove the empty assistant message if there was an error
      setConversation(prev => prev.filter(msg => msg.content !== ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 bg-primary-50 border-b border-gray-100">
        <div className="flex items-center">
          <div className="bg-primary-100 rounded-full p-2">
            <Bot className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-600">Powered by AI</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((message, index) => (
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
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
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
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for productivity insights or suggestions..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !query.trim()}
            className="bg-primary-600 text-white p-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 