import { Zap, TrendingUp, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { Tab } from '@headlessui/react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import AiAssistantChat from '../components/AiAssistantChat';

export default function AiAssistant() {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat Interface */}
        <div className="lg:col-span-2">
          <AiAssistantChat />
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