import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, Calendar, TrendingUp, Activity } from 'lucide-react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '../contexts/ThemeContext';

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<TimeFrame>('weekly');
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Sample data for different timeframes
  const timeframeData = useMemo(() => ({
    daily: {
      productivityScores: [85, 78, 92, 88, 76, 82, 90],
      taskCompletionRate: 82,
      timeLogged: [6.5, 7.2, 8.0, 6.8, 7.5, 6.2, 7.0],
      taskDistribution: [15, 10, 8, 12, 5]
    },
    weekly: {
      productivityScores: [70, 65, 85, 75, 90, 80, 95],
      taskCompletionRate: 75,
      timeLogged: [35.5, 38.2, 42.8, 36.8, 40.5, 37.2, 39.0],
      taskDistribution: [12, 8, 5, 7, 3]
    },
    monthly: {
      productivityScores: [75, 82, 78, 88, 85, 92, 87],
      taskCompletionRate: 80,
      timeLogged: [150.5, 162.2, 158.8, 165.8, 155.5, 170.2, 160.0],
      taskDistribution: [45, 32, 28, 35, 20]
    },
    yearly: {
      productivityScores: [82, 85, 88, 84, 90, 87, 92],
      taskCompletionRate: 85,
      timeLogged: [1850.5, 1920.2, 1880.8, 1950.8, 1890.5, 2000.2, 1950.0],
      taskDistribution: [520, 480, 420, 460, 380]
    }
  }), []);

  const getCurrentData = useCallback(() => {
    return timeframeData[timeframe];
  }, [timeframe, timeframeData]);

  const getChartOptions = useCallback((type: string): ApexOptions => {
    const baseOptions: ApexOptions = {
      chart: {
        toolbar: {
          show: false
        },
        foreColor: isDark ? '#9ca3af' : '#4b5563'
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light'
      },
      grid: {
        borderColor: isDark ? '#374151' : '#e5e7eb'
      }
    };

    switch (type) {
      case 'productivity':
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            type: 'line'
          },
          stroke: {
            curve: 'smooth',
            width: 4
          },
          colors: ['#4b1f12'],
          xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yaxis: {
            min: 0,
            max: 100
          }
        };
      case 'timeLogged':
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            type: 'area'
          },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          colors: ['#0D9488'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
              stops: [0, 90, 100]
            }
          },
          xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        };
      case 'taskDistribution':
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            type: 'bar'
          },
          plotOptions: {
            bar: {
              borderRadius: 5,
              columnWidth: '50%'
            }
          },
          colors: ['#4b1f12'],
          xaxis: {
            categories: ['Work', 'Personal', 'Learning', 'Health', 'Other']
          }
        };
      default:
        return baseOptions;
    }
  }, [isDark]);

  const currentData = getCurrentData();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeframe === 'daily'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === 'weekly'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === 'monthly'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeframe === 'yearly'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Productivity Score</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">82%</p>
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5% from last week
              </p>
            </div>
            <div className="bg-primary-100 rounded-lg p-2">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">24/32</p>
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                75% completion rate
              </p>
            </div>
            <div className="bg-secondary-100 rounded-lg p-2">
              <CheckCircle className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Time Logged</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">41.5h</p>
              <p className="mt-1 text-sm text-amber-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                -2.5h from last week
              </p>
            </div>
            <div className="bg-accent-100 rounded-lg p-2">
              <Clock className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                1 task overdue
              </p>
            </div>
            <div className="bg-error-100 rounded-lg p-2">
              <Calendar className="h-6 w-6 text-error-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Trend</h3>
          <Chart 
            options={getChartOptions('productivity')}
            series={[{
              name: 'Productivity Score',
              data: currentData.productivityScores
            }]}
            type="line"
            height={300}
          />
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Logged</h3>
          <Chart 
            options={getChartOptions('timeLogged')}
            series={[{
              name: 'Hours Logged',
              data: currentData.timeLogged
            }]}
            type="area"
            height={300}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
          <Chart 
            options={getChartOptions('taskDistribution')}
            series={[{
              name: 'Tasks',
              data: currentData.taskDistribution
            }]}
            type="bar"
            height={300}
          />
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion</h3>
          <div className="flex flex-col items-center justify-center h-[250px]">
            <Chart 
              options={{
                ...getChartOptions('taskCompletion'),
                chart: { type: 'donut' },
                labels: ['Completed', 'Remaining'],
                colors: ['#4b1f12', '#E5E7EB'],
                legend: { show: false },
                dataLabels: { enabled: false },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '70%'
                    }
                  }
                }
              }}
              series={[currentData.taskCompletionRate, 100 - currentData.taskCompletionRate]}
              type="donut"
              width="100%"
              height={250}
            />
            <div className="mt-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{currentData.taskCompletionRate}%</p>
              <p className="text-sm text-gray-600">Task Completion Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700">View all</button>
        </div>
        <div className="space-y-4">
          {[
            { 
              icon: CheckCircle, 
              color: 'text-success-500', 
              bgColor: 'bg-success-100', 
              title: 'Completed task', 
              description: 'Finalize Q2 project report', 
              time: '2 hours ago' 
            },
            { 
              icon: Clock, 
              color: 'text-accent-500', 
              bgColor: 'bg-accent-100', 
              title: 'Logged time', 
              description: '3.5 hours on Website redesign', 
              time: '4 hours ago' 
            },
            { 
              icon: AlertTriangle, 
              color: 'text-error-500', 
              bgColor: 'bg-error-100', 
              title: 'Deadline approaching', 
              description: 'Client presentation due tomorrow', 
              time: '1 day ago' 
            },
            { 
              icon: TrendingUp, 
              color: 'text-primary-500', 
              bgColor: 'bg-primary-100', 
              title: 'Productivity increased', 
              description: 'Your focus time has improved by 15%', 
              time: '2 days ago' 
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${item.bgColor} rounded-lg p-2`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}