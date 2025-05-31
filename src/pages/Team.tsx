import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Mail, UserPlus, MessageSquare, Send, Check, 
  Clock, User, X, MoreHorizontal, Edit2
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

export default function Team() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  // Sample team members data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Project Manager',
      status: 'online'
    },
    {
      id: '2',
      name: 'Samantha Lee',
      email: 'samantha@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'UX Designer',
      status: 'online'
    },
    {
      id: '3',
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Frontend Developer',
      status: 'away',
      lastActive: '23 min ago'
    },
    {
      id: '4',
      name: 'Jessica Williams',
      email: 'jessica@example.com',
      avatar: 'https://i.pravatar.cc/150?img=10',
      role: 'Backend Developer',
      status: 'offline',
      lastActive: '3 hours ago'
    }
  ]);

  // Sample messages
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '101',
        sender: '1',
        content: 'Hey, how\'s the project coming along?',
        timestamp: new Date('2025-03-20T09:32:00'),
        isCurrentUser: false
      },
      {
        id: '102',
        sender: 'currentUser',
        content: 'Going well! I\'ve completed the initial setup and started working on the core features.',
        timestamp: new Date('2025-03-20T09:35:00'),
        isCurrentUser: true
      },
      {
        id: '103',
        sender: '1',
        content: 'Great! Let\'s sync up in the afternoon to review progress.',
        timestamp: new Date('2025-03-20T09:37:00'),
        isCurrentUser: false
      },
      {
        id: '104',
        sender: 'currentUser',
        content: 'Sounds good, I\'ll have a demo ready by then.',
        timestamp: new Date('2025-03-20T09:38:00'),
        isCurrentUser: true
      }
    ],
    '2': [
      {
        id: '201',
        sender: 'currentUser',
        content: 'Hi Samantha, can you share the latest design mockups?',
        timestamp: new Date('2025-03-19T14:22:00'),
        isCurrentUser: true
      },
      {
        id: '202',
        sender: '2',
        content: 'Sure thing! I\'ve just uploaded them to the shared folder. Let me know what you think!',
        timestamp: new Date('2025-03-19T14:25:00'),
        isCurrentUser: false
      },
      {
        id: '203',
        sender: 'currentUser',
        content: 'Thanks! I\'ll take a look and provide feedback later today.',
        timestamp: new Date('2025-03-19T14:27:00'),
        isCurrentUser: true
      }
    ]
  });

  const sendMessage = () => {
    if (!activeChat || !messageText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'currentUser',
      content: messageText,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    
    setMessageText('');
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    // Normally would send invitation here
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const getStatusClass = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-success-500';
      case 'away': return 'bg-warning-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const selectedMember = teamMembers.find(member => member.id === activeChat);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <button
          onClick={() => setShowInviteForm(true)}
          className="btn btn-primary flex items-center"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Team Member
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Invite Team Member</h2>
            <button onClick={() => setShowInviteForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="invite-email" className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="pl-10 input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="invite-role" className="label">Role</label>
              <select id="invite-role" className="input">
                <option value="">Select role...</option>
                <option value="team-member">Team Member</option>
                <option value="project-manager">Project Manager</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
              </select>
            </div>
            <div>
              <label htmlFor="invite-message" className="label">Personal Message (Optional)</label>
              <textarea
                id="invite-message"
                placeholder="Write a personal invitation message..."
                rows={3}
                className="input"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowInviteForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="btn btn-primary"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Team Members</h2>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{teamMembers.length}</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                onClick={() => setActiveChat(member.id)}
                className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-colors ${
                  activeChat === member.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-10 w-10 rounded-full"
                  />
                  <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${getStatusClass(member.status)}`}></span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500 truncate">{member.role}</p>
                </div>
                <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                  {member.status === 'online' ? (
                    <span className="text-xs text-success-600 font-medium">Online</span>
                  ) : (
                    <span className="text-xs text-gray-500">{member.lastActive}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2 flex flex-col h-[600px]">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={selectedMember?.avatar} 
                      alt={selectedMember?.name} 
                      className="h-8 w-8 rounded-full"
                    />
                    <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-1 ring-white ${getStatusClass(selectedMember?.status || 'offline')}`}></span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{selectedMember?.name}</h3>
                    <p className="text-xs text-gray-500">{selectedMember?.role}</p>
                  </div>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } flex w-full items-center px-4 py-2 text-sm`}
                            >
                              <User className="mr-3 h-4 w-4" />
                              View Profile
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } flex w-full items-center px-4 py-2 text-sm`}
                            >
                              <Clock className="mr-3 h-4 w-4" />
                              View Activity
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } flex w-full items-center px-4 py-2 text-sm`}
                            >
                              <Edit2 className="mr-3 h-4 w-4" />
                              Add to Project
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages[activeChat] || []).map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.isCurrentUser 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isCurrentUser ? 'text-primary-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {(!messages[activeChat] || messages[activeChat].length === 0) && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start a conversation with {selectedMember?.name}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-primary-600 text-white p-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 max-w-md px-6">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-medium mb-2">Team Chat</h3>
                <p>Select a team member to start chatting or collaborate on projects together.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Invitations */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
        <div className="divide-y divide-gray-100">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-2">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">david.nguyen@example.com</p>
                <p className="text-xs text-gray-500">Developer • Invited 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <button className="p-1 text-success-500 hover:text-success-600">
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-2">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">emma.taylor@example.com</p>
                <p className="text-xs text-gray-500">Designer • Invited 3 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <button className="p-1 text-success-500 hover:text-success-600">
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}