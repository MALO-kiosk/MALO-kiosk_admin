
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import FirstPage from './pages/FirstPage';
import MenuPage from './pages/MenuPage';
import OptionPage from './pages/OptionPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// 인증이 필요한 페이지를 보호하는 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route 
        path="/first" 
        element={
          <ProtectedRoute>
            <FirstPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute>
            <MenuPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/option" 
        element={
          <ProtectedRoute>
            <OptionPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
