import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, TrendingUp, Clock, Users, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-primary-600">STRIVE</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-outline"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="btn btn-primary"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
              >
                Track Progress.
                <br />
                Achieve More.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-primary-100 max-w-xl mb-8"
              >
                STRIVE helps you track your progress, optimize your workflow, and achieve your goals with powerful AI insights and team collaboration.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button 
                  onClick={() => navigate('/register')}
                  className="btn px-8 py-3 bg-white text-primary-800 hover:bg-gray-100 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started for Free
                </button>
                <button className="btn px-8 py-3 bg-primary-700 text-white hover:bg-primary-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Watch Demo
                </button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="STRIVE Dashboard Preview" 
                  className="w-full rounded-2xl" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features to Boost Your Productivity</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">Everything you need to track progress, collaborate with your team, and receive AI-powered insights.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Task Management</h3>
              <p className="text-gray-600">Create, organize, and complete tasks with ease. Track progress and set deadlines with our intuitive interface.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-600 mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">Visualize your progress with beautiful charts and graphs. Gain insights into your productivity trends.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center text-accent-600 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
              <p className="text-gray-600">Log your time manually or use our automatic timer. See where your time goes and optimize your workflow.</p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center text-success-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">Invite your team members, assign tasks, and collaborate in real-time. Keep everyone on the same page.</p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center text-error-600 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">Get personalized recommendations and insights from our advanced AI assistant. Optimize your productivity.</p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center text-warning-600 mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Note Taking</h3>
              <p className="text-gray-600">Capture your thoughts and ideas. Our AI can convert your notes into actionable tasks automatically.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto mb-8">Join thousands of users who use STRIVE to track their progress and achieve their goals.</p>
          <button 
            onClick={() => navigate('/register')}
            className="btn px-8 py-3 bg-white text-primary-800 hover:bg-gray-100 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Testimonials</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">STRIVE</span>
            </div>
            <p>© 2025 STRIVE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}