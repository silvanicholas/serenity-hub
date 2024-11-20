import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import styles from './Login.module.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);    

    const handleToggle = () => {
        setIsSignUp(!isSignUp);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const endpoint = isSignUp ? '/auth/register' : '/auth/login';
            const payload = {
                email,
                password,
                ...(isSignUp && { username })
            };

            const response = await axios.post(endpoint, payload);

            if (!isSignUp) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userName', response.data.username); // Save username
                navigate('/dashboard');
            } else {
                alert("Account created successfully! Please log in.");
                setIsSignUp(false);
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setErrorMessage(isSignUp ? 'Sign Up Failed. Please try again.' : 'Login Failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleLogin = async (credentialResponse) => {
        setIsLoading(true);
        try {
            console.log('Google Response:', credentialResponse);

            const response = await axios.post('/auth/google', {
                credential: credentialResponse.credential
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.data) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userName', response.data.username);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Google Login Failed', error);
            setErrorMessage(error.response?.data?.message || 'Google login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className={styles.pagecontainer}>
            <div className={styles.title}>Serenity Hub</div>
            <div className={styles.subTitle}>Your Mindful Study Companion</div>
            <div className={styles.formContainer}>
                <h2 className={styles.heading}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    
                    {isSignUp && (
                        <div className={styles.inputGroup}>
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                    )}
                    
                    <div className={styles.inputGroup}>
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={`${styles.button} ${isLoading ? styles.loading : ''}`} disabled={isLoading}>
                        {isLoading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            isSignUp ? 'Sign Up' : 'Sign In'
                        )}
                    </button>

                    <div className={styles.divider}>or continue with</div>
                    
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            setErrorMessage('Google login failed. Please try again.');
                        }}
                        useOneTap
                    />
                </form>
                <p className={styles.toggleText}>
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <span onClick={handleToggle} className={styles.toggleLink}>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;