import React, { useState } from 'react';
import './css/LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = () => {
        if (email === 'root' && password === '1234') {
            setError(false);
            alert('로그인 성공!');
            // 여기에 로그인 성공 후 이동할 페이지 로직 추가 (예: navigate('/menu'))
        } else {
            setError(true);
        }
    };

    return (
        <div className="login-container">
            <img src="/img/MALO_color.svg" alt="MALO Logo" className="login-logo" />
            <h1 className="login-title">키오스크 관리자 로그인</h1>
            
            <div className="login-input-group">
                <div className="login-input-wrapper">
                    <input 
                        type="text" 
                        placeholder="email" 
                        className={`login-input ${error ? 'error' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    />
                    <img 
                        src="/img/prime_lock.svg" 
                        alt="Lock Icon" 
                        className={`login-input-icon ${error ? 'error' : ''}`} 
                    />
                </div>

                {error && <p className="error-message">* 아이디 / 비밀번호를 확인해주세요.</p>}

                <button className="login-button" onClick={handleLogin}>log in</button>
            </div>
            
            <a href="/signup" className="create-account-link">create an account</a>
        </div>
    );
};

export default LoginPage;
