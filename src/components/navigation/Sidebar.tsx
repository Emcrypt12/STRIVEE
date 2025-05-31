import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X, Home, FileText, Users, Bot, MessageSquare, LayoutDashboard, Activity, CheckSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { currentUser } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Tasks', href: '/app/tasks', icon: CheckSquare },
    { name: 'Notepad', href: '/app/notepad', icon: FileText },
    { name: 'Team', href: '/app/team', icon: Users },
    { name: 'AI Assistant', href: '/app/ai-assistant', icon: Bot },
    { name: 'Chatbot', href: '/app/chatbot', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-900">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-white" />
                    <span className="ml-2 text-white text-2xl font-bold">STRIVE</span>
                  </div>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-800 text-white'
                            : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                        }`
                      }
                      end={item.href === '/app'}
                    >
                      <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <div className="h-9 w-9 rounded-full bg-primary-700 flex items-center justify-center text-white text-lg font-semibold">
                        {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">
                        {currentUser?.displayName || currentUser?.email || 'User'}
                      </p>
                      <p className="text-sm font-medium text-primary-200 group-hover:text-primary-100">
                        View profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-primary-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Activity className="h-8 w-8 text-white" />
                <span className="ml-2 text-white text-2xl font-bold">STRIVE</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-800 text-white'
                          : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                      }`
                    }
                    end={item.href === '/app'}
                  >
                    <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-9 w-9 rounded-full bg-primary-700 flex items-center justify-center text-white text-lg font-semibold">
                      {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {currentUser?.displayName || currentUser?.email || 'User'}
                    </p>
                    <p className="text-xs font-medium text-primary-200 group-hover:text-primary-100">
                      View profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}