import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IncidentProvider } from './contexts/IncidentContext';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import DashboardCivilian from './pages/DashboardCivilian';
import DashboardAuthority from './pages/DashboardAuthority';
import DashboardAdmin from './pages/DashboardAdmin';
import MapPage from './pages/MapPage';
import IncidentDetailPage from './pages/IncidentDetailsPage';
import Analytics from './pages/AnalyticsPage';
import IncidentsPage from './pages/IncidentPage';
import IncidentForm from './pages/Alert';
import AlertControl from './pages/AlertControl';
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'admin':
      return <DashboardAdmin />;
    case 'authority':
      return <DashboardAuthority />;
    case 'civilian':
    default:
      return <DashboardCivilian />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <IncidentProvider>
          <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                   <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/map" element={
                    <ProtectedRoute>
                      <MapPage />
                    </ProtectedRoute>
                  } 
                />  
                <Route path="/alerts" element={
  <ProtectedRoute allowedRoles={['authority', 'admin', 'civilian']}>
    <IncidentForm />
  </ProtectedRoute>
} />            <Route path="/incident-form" element={<IncidentForm/>} />
                <Route path="/incidents/:id" element={<IncidentDetailPage />} />
                <Route path="/alerts" element={<AlertControl />} />
                <Route path="/reports" element={<Navigate to="/incidents" replace />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>
          </div>
        </IncidentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;