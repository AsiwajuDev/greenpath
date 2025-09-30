import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuthStore } from './hooks/authStore';
import { Header } from './component/Header';
import { Login } from './component/Login';
import { Dashboard } from './component/Dashboard';
import { IdeaValidator } from './component/IdeaValidator';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  console.log(isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Header />}

        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/validate"
            element={
              isAuthenticated ? (
                <IdeaValidator />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
