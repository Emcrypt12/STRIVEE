import { useState, useEffect } from 'react';
import { Bot, Send, TrendingUp, Clock, Calendar, Target } from 'lucide-react';
import { sendMessageToAssistant, Message } from '../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface UserInsight {
  productivityScore: number;
  taskCompletionRate: number;
  focusTime: number;
  streak: number;
  topChallenges: string[];
  recentAchievements: string[];
  suggestedImprovements: string[];
}

interface AiAssistantChatProps {
  initialMessage?: string;
}

export default function AiAssistantChat({ initialMessage = 'Hello! I\'m Bob, your AI productivity assistant. I can help you optimize your workflow and achieve your goals. I have access to your performance data and can provide personalized insights.' }: AiAssistantChatProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInsights, setUserInsights] = useState<UserInsight>({
    productivityScore: 85,
    taskCompletionRate: 78,
    focusTime: 6.5,
    streak: 12,
    topChallenges: [
      'Context switching during deep work',
      'Meeting overload on Wednesdays',
      'Project prioritization'
    ],
    recentAchievements: [
      'Completed ML course module',
      'Maintained 12-day streak',
      'Improved focus time by 15%'
    ],
    suggestedImprovements: [
      'Schedule focused work blocks in the morning',
      'Group meetings on specific days',
      'Use the Pomodoro technique for better focus'
    ]
  });

  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'assistant',
      content: initialMessage
    }
  ]);

  // Simulate fetching user insights
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchUserInsights = async () => {
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // User insights are already set in state
    };

    fetchUserInsights();
  }, []);

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

      // Enhance the messages with user insights context
      const contextEnhancedMessages = [
        ...conversation,
        {
          role: 'system',
          content: `User Context:
            - Productivity Score: ${userInsights.productivityScore}%
            - Task Completion Rate: ${userInsights.taskCompletionRate}%
            - Daily Focus Time: ${userInsights.focusTime} hours
            - Current Streak: ${userInsights.streak} days
            - Recent Achievements: ${userInsights.recentAchievements.join(', ')}
            - Top Challenges: ${userInsights.topChallenges.join(', ')}
          `
        },
        userMessage
      ];

      await sendMessageToAssistant(contextEnhancedMessages, (chunk) => {
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
      toast.error('Failed to get response. Please try again.');
      // Remove the empty assistant message if there was an error
      setConversation(prev => prev.filter(msg => msg.content !== ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Chat Interface */}
      <div className="flex-1">
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
      </div>

      {/* User Insights Panel */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-primary-600 mr-2" />
                <span className="text-sm text-gray-600">Productivity Score</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userInsights.productivityScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-success-600 mr-2" />
                <span className="text-sm text-gray-600">Task Completion</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userInsights.taskCompletionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-accent-600 mr-2" />
                <span className="text-sm text-gray-600">Daily Focus Time</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userInsights.focusTime} hrs</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-secondary-600 mr-2" />
                <span className="text-sm text-gray-600">Current Streak</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userInsights.streak} days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Achievements</h3>
          <div className="space-y-2">
            {userInsights.recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-success-100 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-success-500"></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Areas for Improvement</h3>
          <div className="space-y-2">
            {userInsights.topChallenges.map((challenge, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-error-100 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-error-500"></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{challenge}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested Improvements</h3>
          <div className="space-y-2">
            {userInsights.suggestedImprovements.map((suggestion, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}