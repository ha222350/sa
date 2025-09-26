import React, { useState } from 'react';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!email || !password) {
            setErrorMsg('Please fill in all fields');
            return;
        }

        try {
            // Use full backend URL for login
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMsg('Login successful! Redirecting...');
                // Redirect logic can be added here
            } else {
                setErrorMsg(data.message || 'Login failed');
                console.error('Login API error:', data);
            }
        } catch (error) {
            setErrorMsg('An error occurred. Please try again later.');
            console.error('Login network error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                />
            </div>
            {errorMsg && (
                <div className="error-notification">
                    <span>{errorMsg}</span>
                </div>
            )}
            {successMsg && (
                <div className="success-notification">
                    <span>{successMsg}</span>
                </div>
            )}
            <button type="submit" className="btn-primary w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Sign in to Dashboard
            </button>
        </form>
    );
}

export default LoginForm;