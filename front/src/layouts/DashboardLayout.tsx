import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Car className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800">Parking System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="text-gray-600 mr-2" size={18} />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {user?.role === 'guard' ? 'Guard' : 'Student'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center"
            >
              <LogOut size={18} className="mr-1" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-6 px-4">
        <Outlet />
      </main>

      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} University Parking Management
      </footer>
    </div>
  );
};

export default DashboardLayout;