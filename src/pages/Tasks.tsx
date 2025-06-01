import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, Calendar, Clock, Edit2, Trash2, ChevronDown, ChevronUp, BookOpen, Trophy, Star, Target, Award, TrendingUp, Zap, CheckSquare, Save } from 'lucide-react';
import { format, differenceInDays, isSameDay, isToday } from 'date-fns';
import Chart from 'react-apexcharts';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import { CheckinData } from '../components/DailyCheckin';

interface DailyCheckin {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad';
  achievements: string[];
  challenges: string[];
  notes: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  dailyProgress: {
    [key: string]: {
      completed: boolean;
      notes: string;
      xpEarned: number;
      checkin?: DailyCheckin;
    }
  };
  isExpanded?: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  condition: (task: Task) => boolean;
}

const BADGES: Badge[] = [
  {
    id: 'first-completion',
    name: 'First Step',
    description: 'Complete your first daily task',
    icon: Star,
    condition: (task) => Object.values(task.dailyProgress).some(day => day.completed)
  },
  {
    id: 'three-day-streak',
    name: 'Momentum Builder',
    description: 'Maintain a 3-day streak',
    icon: TrendingUp,
    condition: (task) => task.streak >= 3
  },
  {
    id: 'seven-day-streak',
    name: 'Consistency Master',
    description: 'Maintain a 7-day streak',
    icon: Award,
    condition: (task) => task.streak >= 7
  },
  {
    id: 'detailed-notes',
    name: 'Reflective Learner',
    description: 'Write detailed notes for 5 days',
    icon: BookOpen,
    condition: (task) => Object.values(task.dailyProgress).filter(day => day.notes.length > 50).length >= 5
  }
];

const XP_PER_COMPLETION = 50;
const XP_STREAK_BONUS = 10;
const XP_DETAILED_NOTES = 20;

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Learn Machine Learning',
      description: 'Complete daily machine learning course modules and practice exercises',
      category: 'Learning',
      startDate: new Date('2025-03-01'),
      level: 1,
      xp: 150,
      streak: 2,
      badges: ['first-completion'],
      dailyProgress: {
        '2025-03-01': { 
          completed: true, 
          notes: 'Completed intro to ML basics', 
          xpEarned: 50,
          checkin: {
            date: '2025-03-01',
            mood: 'great',
            achievements: ['Understood basic ML concepts', 'Completed first exercise'],
            challenges: ['Complex math concepts'],
            notes: 'Feeling motivated to continue learning!'
          }
        },
        '2025-03-02': { 
          completed: true, 
          notes: 'Learned about linear regression', 
          xpEarned: 70,
          checkin: {
            date: '2025-03-02',
            mood: 'good',
            achievements: ['Implemented linear regression', 'Visualized data'],
            challenges: ['Dataset preprocessing'],
            notes: 'Need to practice more with real datasets'
          }
        },
        '2025-03-03': { completed: false, notes: '', xpEarned: 0 }
      }
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [checkinData, setCheckinData] = useState<DailyCheckin>({
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: 'good',
    achievements: [''],
    challenges: [''],
    notes: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Learning'
  });
  const [editingNote, setEditingNote] = useState<{taskId: string, date: string, note: string} | null>(null);

  const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const calculateProgress = (task: Task) => {
    const totalDays = Object.keys(task.dailyProgress).length;
    const completedDays = Object.values(task.dailyProgress).filter(day => day.completed).length;
    return (completedDays / totalDays) * 100;
  };

  const calculateStreak = (dailyProgress: Task['dailyProgress']) => {
    const sortedDates = Object.entries(dailyProgress)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const [date, progress] of sortedDates) {
      const taskDate = new Date(date);
      
      if (!isSameDay(currentDate, taskDate) && differenceInDays(currentDate, taskDate) > 1) {
        break;
      }
      
      if (progress.completed) {
        streak++;
        currentDate = taskDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const checkAndAwardBadges = (task: Task) => {
    const newBadges = BADGES
      .filter(badge => !task.badges.includes(badge.id) && badge.condition(task))
      .map(badge => badge.id);

    if (newBadges.length > 0) {
      const updatedTask = {
        ...task,
        badges: [...task.badges, ...newBadges]
      };
      
      newBadges.forEach(badgeId => {
        const badge = BADGES.find(b => b.id === badgeId);
        if (badge) {
          toast.success(`🏆 New Badge Unlocked: ${badge.name}!`, {
            duration: 4000,
            icon: '🎉'
          });
        }
      });

      return updatedTask;
    }

    return task;
  };

  const addTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      startDate: new Date(),
      level: 1,
      xp: 0,
      streak: 0,
      badges: [],
      dailyProgress: {
        [format(new Date(), 'yyyy-MM-dd')]: {
          completed: false,
          notes: '',
          xpEarned: 0
        }
      }
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', category: 'Learning' });
    setShowAddTask(false);
    toast.success('New task created! Start tracking your progress.');
  };

  const toggleTaskCompletion = (taskId: string, date: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedProgress = {
          ...task.dailyProgress,
          [date]: {
            ...task.dailyProgress[date],
            completed: !task.dailyProgress[date].completed,
            xpEarned: !task.dailyProgress[date].completed ? XP_PER_COMPLETION : 0
          }
        };

        const newStreak = calculateStreak(updatedProgress);
        const streakBonus = newStreak > task.streak ? XP_STREAK_BONUS * (newStreak - task.streak) : 0;
        const notesBonus = task.dailyProgress[date].notes.length > 50 ? XP_DETAILED_NOTES : 0;
        const totalXpGain = !task.dailyProgress[date].completed ? 
          (XP_PER_COMPLETION + streakBonus + notesBonus) : 
          -(task.dailyProgress[date].xpEarned);

        const newXp = Math.max(0, task.xp + totalXpGain);
        const oldLevel = task.level;
        const newLevel = calculateLevel(newXp);

        if (newLevel > oldLevel) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
          toast.success(`🎉 Level Up! You're now level ${newLevel}!`);
        }

        const updatedTask = {
          ...task,
          dailyProgress: updatedProgress,
          streak: newStreak,
          xp: newXp,
          level: newLevel
        };

        return checkAndAwardBadges(updatedTask);
      }
      return task;
    }));
  };

  const updateTaskNote = (taskId: string, date: string, note: string) => {
    if (editingNote?.taskId === taskId && editingNote?.date === date) {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          const wasDetailed = task.dailyProgress[date].notes.length > 50;
          const isNowDetailed = note.length > 50;
          const xpChange = !wasDetailed && isNowDetailed ? XP_DETAILED_NOTES : 0;

          const updatedTask = {
            ...task,
            xp: task.xp + xpChange,
            dailyProgress: {
              ...task.dailyProgress,
              [date]: {
                ...task.dailyProgress[date],
                notes: note,
                xpEarned: task.dailyProgress[date].xpEarned + xpChange
              }
            }
          };

          if (xpChange > 0) {
            toast.success('🌟 Bonus XP earned for detailed notes!');
          }

          return checkAndAwardBadges(updatedTask);
        }
        return task;
      }));
      setEditingNote(null);
      toast.success('Note saved successfully!');
    } else {
      setEditingNote({ taskId, date, note });
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isExpanded: !task.isExpanded };
      }
      return task;
    }));
  };

  const getStreakData = (task: Task) => {
    const dates = Object.keys(task.dailyProgress).sort();
    const streakData = dates.map(date => ({
      x: date,
      y: task.dailyProgress[date].completed ? 1 : 0
    }));

    return [{
      name: 'Completion',
      data: streakData
    }];
  };

  const getXpProgressData = (task: Task) => {
    const dates = Object.keys(task.dailyProgress).sort();
    const xpData = dates.map(date => ({
      x: date,
      y: task.dailyProgress[date].xpEarned
    }));

    return [{
      name: 'XP Earned',
      data: xpData
    }];
  };

  const handleDailyCheckin = (taskId: string) => {
    if (!taskId) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          dailyProgress: {
            ...task.dailyProgress,
            [today]: {
              ...task.dailyProgress[today],
              checkin: checkinData
            }
          }
        };
      }
      return task;
    }));

    setShowCheckin(false);
    setCheckinData({
      date: format(new Date(), 'yyyy-MM-dd'),
      mood: 'good',
      achievements: [''],
      challenges: [''],
      notes: ''
    });
    toast.success('Daily check-in completed!');
  };

  const addAchievement = () => {
    setCheckinData({
      ...checkinData,
      achievements: [...checkinData.achievements, '']
    });
  };

  const addChallenge = () => {
    setCheckinData({
      ...checkinData,
      challenges: [...checkinData.challenges, '']
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...checkinData.achievements];
    newAchievements[index] = value;
    setCheckinData({
      ...checkinData,
      achievements: newAchievements
    });
  };

  const updateChallenge = (index: number, value: string) => {
    const newChallenges = [...checkinData.challenges];
    newChallenges[index] = value;
    setCheckinData({
      ...checkinData,
      challenges: newChallenges
    });
  };

  const removeAchievement = (index: number) => {
    setCheckinData({
      ...checkinData,
      achievements: checkinData.achievements.filter((_, i) => i !== index)
    });
  };

  const removeChallenge = (index: number) => {
    setCheckinData({
      ...checkinData,
      challenges: checkinData.challenges.filter((_, i) => i !== index)
    });
  };

  const renderDailyCheckinModal = () => (
    <AnimatePresence>
      {showCheckin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full mx-4"
          >
            <h2 className="text-xl font-semibold mb-4">Daily Check-in</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">How are you feeling today?</label>
                <select
                  value={checkinData.mood}
                  onChange={(e) => setCheckinData({
                    ...checkinData,
                    mood: e.target.value as DailyCheckin['mood']
                  })}
                  className="input"
                >
                  <option value="great">Great! 😄</option>
                  <option value="good">Good 🙂</option>
                  <option value="okay">Okay 😐</option>
                  <option value="bad">Not so good 😔</option>
                </select>
              </div>

              <div>
                <label className="label">Today's Achievements</label>
                {checkinData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="What did you accomplish?"
                      className="input flex-1"
                    />
                    <button
                      onClick={() => removeAchievement(index)}
                      className="text-gray-400 hover:text-error-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAchievement}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Achievement
                </button>
              </div>

              <div>
                <label className="label">Challenges Faced</label>
                {checkinData.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={challenge}
                      onChange={(e) => updateChallenge(index, e.target.value)}
                      placeholder="What challenges did you face?"
                      className="input flex-1"
                    />
                    <button
                      onClick={() => removeChallenge(index)}
                      className="text-gray-400 hover:text-error-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addChallenge}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Challenge
                </button>
              </div>

              <div>
                <label className="label">Additional Notes</label>
                <textarea
                  value={checkinData.notes}
                  onChange={(e) => setCheckinData({
                    ...checkinData,
                    notes: e.target.value
                  })}
                  placeholder="Any additional thoughts or reflections?"
                  className="input"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowCheckin(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDailyCheckin(selectedTaskId!)}
                  className="btn btn-primary"
                >
                  Complete Check-in
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderTaskCheckin = (task: Task, date: string) => {
    const progress = task.dailyProgress[date];
    const hasCheckin = progress?.checkin;
    const isCurrentDay = isToday(new Date(date));

    if (!progress.completed) return null;

    return (
      <div className="mt-2">
        {hasCheckin ? (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Daily Check-in</span>
              <span className="text-sm text-gray-500">
                Mood: {progress.checkin?.mood === 'great' ? '😄' : 
                      progress.checkin?.mood === 'good' ? '🙂' : 
                      progress.checkin?.mood === 'okay' ? '😐' : '😔'}
              </span>
            </div>
            {progress.checkin?.achievements.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-600">Achievements:</span>
                <ul className="mt-1 space-y-1">
                  {progress.checkin.achievements.map((achievement, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <CheckSquare className="h-3 w-3 text-success-500 mr-1" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {progress.checkin?.challenges.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-600">Challenges:</span>
                <ul className="mt-1 space-y-1">
                  {progress.checkin.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm text-gray-600">• {challenge}</li>
                  ))}
                </ul>
              </div>
            )}
            {progress.checkin?.notes && (
              <div>
                <span className="text-xs font-medium text-gray-600">Notes:</span>
                <p className="text-sm text-gray-600 mt-1">{progress.checkin.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              setSelectedTaskId(task.id);
              setShowCheckin(true);
            }}
            className="w-full mt-2 text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Complete Daily Check-in
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showLevelUp && <Confetti numberOfPieces={200} recycle={false} />}
      {renderDailyCheckinModal()}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowAddTask(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </button>
      </div>

      {showAddTask && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input"
                placeholder="e.g., Learn Machine Learning"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Describe your task and goals"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="input"
              >
                <option value="Learning">Learning</option>
                <option value="Fitness">Fitness</option>
                <option value="Project">Project</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddTask(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="btn btn-primary"
              >
                Create Task
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <div className="ml-4 flex items-center space-x-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                          Level {task.level}
                        </span>
                        <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded-full text-xs font-medium flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {task.xp} XP
                        </span>
                        <span className="px-2 py-1 bg-success-100 text-success-800 rounded-full text-xs font-medium flex items-center">
                          <Trophy className="h-3 w-3 mr-1" />
                          {task.streak} Day Streak
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-gray-600">{task.description}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.badges.map(badgeId => {
                        const badge = BADGES.find(b => b.id === badgeId);
                        if (!badge) return null;
                        
                        return (
                          <div
                            key={badge.id}
                            className="flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                            title={badge.description}
                          >
                            <badge.icon className="h-3 w-3 mr-1" />
                            {badge.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTaskExpansion(task.id)}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    {task.isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(task)}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {Math.round(calculateProgress(task))}%
                    </span>
                  </div>
                </div>

                {task.isExpanded && (
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Streak History</h4>
                        <Chart
                          options={{
                            chart: {
                              type: 'area',
                              toolbar: { show: false },
                              animations: { enabled: true }
                            },
                            stroke: { curve: 'smooth', width: 2 },
                            fill: {
                              type: 'gradient',
                              gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.7,
                                opacityTo: 0.2,
                                stops: [0, 90, 100]
                              }
                            },
                            colors: ['#16a34a'],
                            xaxis: {
                              type: 'datetime',
                              labels: { show: false }
                            },
                            yaxis: {
                              labels: { show: false },
                              min: 0,
                              max: 1
                            },
                            tooltip: {
                              x: {
                                format: 'dd MMM yyyy'
                              }
                            }
                          }}
                          series={getStreakData(task)}
                          type="area"
                          height={200}
                        />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">XP Progress</h4>
                        <Chart
                          options={{
                            chart: {
                              type: 'bar',
                              toolbar: { show: false },
                              animations: { enabled: true }
                            },
                            plotOptions: {
                              bar: {
                                borderRadius: 4,
                                columnWidth: '60%'
                              }
                            },
                            colors: ['#16a34a'],
                            xaxis: {
                              type: 'datetime',
                              labels: { show: false }
                            },
                            yaxis: {
                              labels: { show: false }
                            },
                            tooltip: {
                              x: {
                                format: 'dd MMM yyyy'
                              }
                            }
                          }}
                          series={getXpProgressData(task)}
                          type="bar"
                          height={200}
                        />
                      </div>
                    </div>

                    {Object.entries(task.dailyProgress).map(([date, progress]) => (
                      <div key={date} className="border-t border-gray-100 pt-4">
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {format(new Date(date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                
                          <button
                            onClick={() => toggleTaskCompletion(task.id, date)}
                            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                              progress.completed
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <CheckCircle className={`h-4 w-4 ${progress.completed ? 'text-primary-600' : 'text-gray-400'} mr-1`} />
                            {progress.completed ? 'Completed' : 'Mark Complete'}
                          </button>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-start space-x-2">
                            <textarea
                              value={editingNote?.taskId === task.id && editingNote?.date === date ? editingNote.note : progress.notes}
                              onChange={(e) => {
                                if (editingNote?.taskId === task.id && editingNote?.date === date) {
                                  setEditingNote({ ...editingNote, note: e.target.value });
                                } else {
                                  setEditingNote({ taskId: task.id, date: date, note: e.target.value });
                                }
                              }}
                              placeholder="Add notes about your progress..."
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                              rows={2}
                            />
                            <button
                              onClick={() => updateTaskNote(task.id, date, editingNote?.note || progress.notes)}
                              className="flex-shrink-0 px-3 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md transition-colors duration-200"
                            >
                              {editingNote?.taskId === task.id && editingNote?.date === date ? (
                                <Save className="h-5 w-5" />
                              ) : (
                                <Edit2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {progress.xpEarned > 0 && (
                            <div className="mt-1 text-xs text-success-600 flex items-center">
                              <Zap className="h-3 w-3 mr-1" />
                              Earned {progress.xpEarned} XP
                            </div>
                          )}
                          {renderTaskCheckin(task, date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddTask(true)}
                className="btn btn-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}