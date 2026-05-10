
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import MenuPage from './pages/MenuPage';
import OptionPage from './pages/OptionPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/first" element={<FirstPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/option" element={<OptionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
