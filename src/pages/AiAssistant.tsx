import { useState } from 'react';
import { Bot, Zap, TrendingUp, Clock, AlertTriangle, Calendar, Send } from 'lucide-react';
import { Tab } from '@headlessui/react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { sendMessageToAssistant, Message } from '../services/api';
import toast from 'react-hot-toast';

export default function AiAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you analyze your productivity, suggest improvements, and provide insights on your progress. What would you like to know today?'
    }
  ]);

  // Sample productivity data for visualization
  const productivityScores = [78, 65, 83, 79, 92, 86, 75];
  const productivityTrend: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    colors: ['#6D28D9'],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    markers: {
      size: 5
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const sendMessage = async () => {
    if (!query.trim()) return;
    
    const userMessage: Message = { role: 'user', content: query };
    setConversation(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);
    
    try {
      const response = await sendMessageToAssistant([...conversation, userMessage]);
      setConversation(prev => [...prev, response]);
    } catch (error) {
      toast.error('Failed to get response from AI assistant');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
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
                  <p className="text-sm">{message.content}</p>
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

        {/* AI Insights Panel */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-100">
              <Tab className={({ selected }) => 
                `flex-1 py-3 text-sm font-medium text-center focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }>
                Insights
              </Tab>
              <Tab className={({ selected }) => 
                `flex-1 py-3 text-sm font-medium text-center focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }>
                Suggestions
              </Tab>
            </Tab.List>
            <Tab.Panels className="h-[538px] overflow-y-auto">
              <Tab.Panel className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Productivity Trend</h3>
                  <Chart 
                    options={productivityTrend}
                    series={[{ name: 'Productivity', data: productivityScores }]}
                    type="line"
                    height={200}
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500">Key Insights</h3>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-primary-100 rounded-full p-1.5 mr-2">
                        <TrendingUp className="h-4 w-4 text-primary-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">Peak Performance Time</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 pl-8">Your productivity peaks between 9-11 AM</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-secondary-100 rounded-full p-1.5 mr-2">
                        <Clock className="h-4 w-4 text-secondary-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">Time Distribution</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 pl-8">40% development, 25% meetings, 20% planning, 15% other</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-error-100 rounded-full p-1.5 mr-2">
                        <AlertTriangle className="h-4 w-4 text-error-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">Risk Factors</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 pl-8">Frequent context switching detected</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-accent-100 rounded-full p-1.5 mr-2">
                        <Calendar className="h-4 w-4 text-accent-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">Upcoming Load</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 pl-8">Heavy meeting schedule next Tuesday</p>
                  </div>
                </div>
              </Tab.Panel>
              
              <Tab.Panel className="p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">AI Recommendations</h3>
                
                {[
                  {
                    icon: Zap,
                    color: 'text-primary-600',
                    bgColor: 'bg-primary-100',
                    title: 'Implement Time Blocking',
                    description: 'Schedule focused work periods of 90 minutes with short breaks in between.'
                  },
                  {
                    icon: Clock,
                    color: 'text-secondary-600',
                    bgColor: 'bg-secondary-100',
                    title: 'Optimize Meeting Schedule',
                    description: 'Group meetings on Tuesday and Thursday afternoons to preserve morning focus time.'
                  },
                  {
                    icon: TrendingUp,
                    color: 'text-success-600',
                    bgColor: 'bg-success-100',
                    title: 'Task Prioritization',
                    description: 'Focus on high-impact tasks during your peak productivity hours (9-11 AM).'
                  },
                  {
                    icon: Calendar,
                    color: 'text-accent-600',
                    bgColor: 'bg-accent-100',
                    title: 'Weekly Planning',
                    description: 'Set aside 30 minutes every Friday to plan the upcoming week.'
                  }
                ].map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`${item.bgColor} rounded-full p-1.5 mr-2`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 pl-8">{item.description}</p>
                  </div>
                ))}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}