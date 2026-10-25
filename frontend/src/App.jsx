import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecordList from './pages/RecordList';
import MedicationList from './pages/MedicationList';
import AppointmentList from './pages/AppointmentList';
import Profile from './pages/Profile';
import ShareQr from './pages/ShareQr';
import DoctorShare from './pages/DoctorShare';

function Protected({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Loading…
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-linen">
      <Sidebar />
      <main className="px-4 py-6 pb-24 md:ml-64 md:px-8 md:pb-8">{children}</main>
    </div>
  );
}

function ToastHost() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function onError(event) {
      setMessage(event.detail);
    }
    window.addEventListener('medivault:error', onError);
    return () => window.removeEventListener('medivault:error', onError);
  }, []);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] max-w-sm rounded-xl border border-critical/20 bg-critical-tint px-4 py-3 text-sm text-critical shadow-lift">
      {message}
    </div>
  );
}

export default function App() {
  return (
    <>
      <ToastHost />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/share/:token" element={<DoctorShare />} />
        <Route
          path="/"
          element={
            <Protected>
              <Shell>
                <Dashboard />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/records"
          element={
            <Protected>
              <Shell>
                <RecordList />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/medications"
          element={
            <Protected>
              <Shell>
                <MedicationList />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/appointments"
          element={
            <Protected>
              <Shell>
                <AppointmentList />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/qr"
          element={
            <Protected>
              <Shell>
                <ShareQr />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Shell>
                <Profile />
              </Shell>
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
