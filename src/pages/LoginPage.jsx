import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoginPage.css';
import { loginUser } from '../utils/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await loginUser(email, password);
            
            if (result.success) {
                setError('');
                alert('로그인 성공!');
                // 메뉴 페이지로 이동
                navigate('/menu');
            } else {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <img src="/img/MALO_color.svg" alt="MALO Logo" className="login-logo" />
            <h1 className="login-title">키오스크 관리자 로그인</h1>
            
            <div className="login-input-group">
                <div className="login-input-wrapper">
                    <input 
                        type="email" 
                        placeholder="email" 
                        className={`login-input ${error ? 'error' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <img 
                        src="/img/majesticons_mail-line.svg" 
                        alt="Mail Icon" 
                        className={`login-input-icon ${error ? 'error' : ''}`} 
                    />
                </div>
                
                <div className="login-input-wrapper">
                    <input 
                        type="password" 
                        placeholder="password" 
                        className={`login-input ${error ? 'error' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <img 
                        src="/img/prime_lock.svg" 
                        alt="Lock Icon" 
                        className={`login-input-icon ${error ? 'error' : ''}`} 
                    />
                </div>

                {error && <p className="error-message">* {error}</p>}

                <button 
                    className="login-button" 
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? '로그인 중...' : 'log in'}
                </button>
            </div>
            
            <a href="/signup" className="create-account-link">create an account</a>
        </div>
    );
};

export default LoginPage;
