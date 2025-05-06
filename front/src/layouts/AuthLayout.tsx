import React from 'react';
import { Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Car className="text-blue-600 mr-2" size={24} />
          <h1 className="text-xl font-bold text-gray-800">University Parking System</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white p-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} University Parking Management
      </footer>
    </div>
  );
};

export default AuthLayout;