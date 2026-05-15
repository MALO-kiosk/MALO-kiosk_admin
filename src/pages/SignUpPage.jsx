import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SignUpPage.css';
import { signupUser } from '../utils/api';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        email: false,
        name: false,
        password: false,
        rePassword: false,
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        // 입력값 검증 (필드별 에러 설정)
        const newFieldErrors = { email: false, name: false, password: false, rePassword: false };
        let hasError = false;
        if (!email) { newFieldErrors.email = true; hasError = true; }
        if (!name) { newFieldErrors.name = true; hasError = true; }
        if (!password) { newFieldErrors.password = true; hasError = true; }
        if (!rePassword) { newFieldErrors.rePassword = true; hasError = true; }

        if (hasError) {
            setFieldErrors(newFieldErrors);
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (password !== rePassword) {
            setFieldErrors({ ...newFieldErrors, password: true, rePassword: true });
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password.length < 6) {
            setFieldErrors({ ...newFieldErrors, password: true });
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await signupUser(email, password, name);
            
            if (result.success) {
                alert('회원가입이 완료되었습니다. 로그인해주세요.');
                navigate('/login');
            } else {
                setError(result.error || '회원가입 중 오류가 발생했습니다.');
                // 서버 에러 발생 시 전체 필드 에러 해제 (선택)
                setFieldErrors({ email:false, name:false, password:false, rePassword:false });
            }
        } catch (err) {
            setError('회원가입 중 오류가 발생했습니다.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    };

    // Clear field error when user types
    const onEmailChange = (e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: false })); };
    const onNameChange = (e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: false })); };
    const onPasswordChange = (e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: false })); };
    const onRePasswordChange = (e) => { setRePassword(e.target.value); setFieldErrors(prev => ({ ...prev, rePassword: false })); };

    return (
        <div className="signup-container">
            <img src="/img/MALO_color.svg" alt="MALO Logo" className="signup-logo" />
            <h1 className="signup-title">키오스크 관리자 회원가입</h1>
            
            <div className="signup-input-group">
                <div className="signup-input-wrapper">
                    <input 
                        type="email" 
                        placeholder="email" 
                        className={`signup-input ${fieldErrors.email ? 'error' : ''}`}
                        value={email}
                        onChange={onEmailChange}
                        disabled={loading}
                    />
                    <img src="/img/majesticons_mail-line.svg" alt="Mail Icon" className={`signup-input-icon ${fieldErrors.email ? 'error' : ''}`} />
                </div>

                <div className="signup-input-wrapper">
                    <input 
                        type="text" 
                        placeholder="name" 
                        className={`signup-input ${fieldErrors.name ? 'error' : ''}`}
                        value={name}
                        onChange={onNameChange}
                        disabled={loading}
                    />
                    <img src="/img/hugeicons_user-03.svg" alt="User Icon" className={`signup-input-icon ${fieldErrors.name ? 'error' : ''}`} />
                </div>
                
                <div className="signup-input-wrapper">
                    <input 
                        type="password" 
                        placeholder="password" 
                        className={`signup-input ${fieldErrors.password ? 'error' : ''}`}
                        value={password}
                        onChange={onPasswordChange}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <img src="/img/prime_lock.svg" alt="Lock Icon" className={`signup-input-icon ${fieldErrors.password ? 'error' : ''}`} />
                </div>

                <div className="signup-input-wrapper">
                    <input 
                        type="password" 
                        placeholder="re-enter password" 
                        className={`signup-input ${fieldErrors.rePassword ? 'error' : ''}`}
                        value={rePassword}
                        onChange={onRePasswordChange}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <img src="/img/prime_lock.svg" alt="Lock Icon" className={`signup-input-icon ${fieldErrors.rePassword ? 'error' : ''}`} />
                </div>

                {error && <p className="error-message">* {error}</p>}

                <button 
                    className="signup-button" 
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'create an account'}
                </button>
            </div>
            
            <a href="/login" className="login-link">Already have an account? Log in</a>
        </div>
    );
};

export default SignUpPage;
