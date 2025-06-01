import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Star, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface DailyCheckinProps {
  onSave: (data: CheckinData) => void;
  existingCheckin?: CheckinData;
}

export interface CheckinData {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad';
  learnings: string[];
  challenges: string[];
  goals: string[];
  score: number;
}

export default function DailyCheckin({ onSave, existingCheckin }: DailyCheckinProps) {
  const [checkinData, setCheckinData] = useState<CheckinData>(existingCheckin || {
    date: new Date().toISOString().split('T')[0],
    mood: 'good',
    learnings: [''],
    challenges: [''],
    goals: [''],
    score: 0
  });

  const calculateScore = (data: Partial<CheckinData>): number => {
    let score = 0;
    
    // Base score for completing check-in
    score += 10;
    
    // Score for mood
    if (data.mood === 'great') score += 5;
    else if (data.mood === 'good') score += 3;
    else if (data.mood === 'okay') score += 1;
    
    // Score for learnings
    const validLearnings = data.learnings?.filter(l => l.trim().length > 0) || [];
    score += validLearnings.length * 5;
    
    // Bonus for detailed learnings
    validLearnings.forEach(learning => {
      if (learning.length > 50) score += 3;
    });
    
    // Score for challenges acknowledged
    const validChallenges = data.challenges?.filter(c => c.trim().length > 0) || [];
    score += validChallenges.length * 3;
    
    // Score for setting goals
    const validGoals = data.goals?.filter(g => g.trim().length > 0) || [];
    score += validGoals.length * 4;
    
    return score;
  };

  const handleSave = () => {
    const score = calculateScore(checkinData);
    const finalData = { ...checkinData, score };
    onSave(finalData);
    toast.success(`Check-in completed! You earned ${score} points! 🎉`);
  };

  const addItem = (type: 'learnings' | 'challenges' | 'goals') => {
    setCheckinData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateItem = (type: 'learnings' | 'challenges' | 'goals', index: number, value: string) => {
    setCheckinData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const removeItem = (type: 'learnings' | 'challenges' | 'goals', index: number) => {
    setCheckinData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Check-in</h2>
      
      <div className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
          <div className="flex gap-4">
            {[
              { value: 'great', icon: Smile, label: 'Great', color: 'text-success-500' },
              { value: 'good', icon: Smile, label: 'Good', color: 'text-primary-500' },
              { value: 'okay', icon: Meh, label: 'Okay', color: 'text-warning-500' },
              { value: 'bad', icon: Frown, label: 'Not Great', color: 'text-error-500' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setCheckinData(prev => ({ ...prev, mood: option.value as any }))}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  checkinData.mood === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <option.icon className={`h-6 w-6 mx-auto mb-1 ${option.color}`} />
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Learnings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What did you learn today?</label>
          {checkinData.learnings.map((learning, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={learning}
                onChange={(e) => updateItem('learnings', index, e.target.value)}
                placeholder="Share your learning..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                rows={2}
              />
              <button
                onClick={() => removeItem('learnings', index)}
                className="text-gray-400 hover:text-error-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('learnings')}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Learning
          </button>
        </div>

        {/* Challenges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What challenges did you face?</label>
          {checkinData.challenges.map((challenge, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={challenge}
                onChange={(e) => updateItem('challenges', index, e.target.value)}
                placeholder="Describe a challenge..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={() => removeItem('challenges', index)}
                className="text-gray-400 hover:text-error-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('challenges')}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Challenge
          </button>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What are your goals for tomorrow?</label>
          {checkinData.goals.map((goal, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => updateItem('goals', index, e.target.value)}
                placeholder="Set a goal..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={() => removeItem('goals', index)}
                className="text-gray-400 hover:text-error-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('goals')}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </button>
        </div>

        {/* Preview Score */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Estimated Score</span>
            </div>
            <span className="text-lg font-bold text-primary-600">{calculateScore(checkinData)} points</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Complete more sections and add detailed responses to earn more points!
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Check-in
          </button>
        </div>
      </div>
    </motion.div>
  );
}