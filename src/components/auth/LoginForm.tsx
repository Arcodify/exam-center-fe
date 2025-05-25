// components/LoginForm.tsx
import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    username,
    setUsername,
    password,
    setPassword,
    errorMessage,
    isPending,
    handleSubmit,
  } = useLogin();

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <h3 className="text-center font-bold text-l mb-10">Login Details</h3>

        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm mb-1 font-medium">
            Username <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            disabled={isPending}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm mb-1 font-medium">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative flex">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              disabled={isPending}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isPending}
            >
              {showPassword ? (
                <img src="/icon/hide.png" alt="hide" className="w-6" />
              ) : (
                <img src="/icon/show.png" alt="show" className="w-6" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
