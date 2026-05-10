import React, { useState } from 'react';
import './css/SignUpPage.css';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleSignUp = () => {
        if (password !== rePassword) {
            setPasswordError(true);
            return;
        }
        setPasswordError(false);
        alert('회원가입 요청!');
    };

    return (
        <div className="signup-container">
            <img src="/img/MALO_color.svg" alt="MALO Logo" className="signup-logo" />
            <h1 className="signup-title">키오스크 관리자 회원가입</h1>
            
            <div className="signup-input-group">
                <div className="signup-input-wrapper">
                    <input 
                        type="email" 
                        placeholder="email" 
                        className="signup-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <img src="/img/majesticons_mail-line.svg" alt="Mail Icon" className="signup-input-icon" />
                </div>

                <div className="signup-input-wrapper">
                    <input 
                        type="text" 
                        placeholder="name" 
                        className="signup-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <img src="/img/hugeicons_user-03.svg" alt="User Icon" className="signup-input-icon" />
                </div>
                
                <div className="signup-input-wrapper">
                    <input 
                        type="password" 
                        placeholder="password" 
                        className="signup-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="/img/prime_lock.svg" alt="Lock Icon" className="signup-input-icon" />
                </div>

                <div className="signup-input-wrapper">
                    <input 
                        type="password" 
                        placeholder="re-enter password" 
                        className={`signup-input ${passwordError ? 'error' : ''}`}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                    />
                    <img src="/img/prime_lock.svg" alt="Lock Icon" className={`signup-input-icon ${passwordError ? 'error' : ''}`} />
                </div>

                {passwordError && <p className="error-message">* 비밀번호가 일치하지 않습니다.</p>}

                <button className="signup-button" onClick={handleSignUp}>create an account</button>
            </div>
            
            <a href="/login" className="login-link">Already have an account? Log in</a>
        </div>
    );
};

export default SignUpPage;
