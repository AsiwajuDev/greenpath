import React from 'react';
import { useAuthStore } from '../stores/authStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-600">
                🌱 GreenPath
              </span>
            </div>
            <nav className="ml-6 flex space-x-8">
              <a
                href="/"
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="/validate"
                className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium"
              >
                Validate Idea
              </a>
              <a
                href="/projects"
                className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium"
              >
                My Projects
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-700">
                  Welcome, {user.displayName}
                </span>
                <button
                  onClick={logout}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
