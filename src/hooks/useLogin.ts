// hooks/useLogin.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { http } from '../utils/http';
import { useAuthStore } from '../stores/authStore';
import type {
  LoginCredentials,
  LoginResponse,
  UserData,
  LoginError,
} from '../types/auth.types';

/**
 * Custom hook that combines form state management with TanStack Query login mutation
 * Maintains separation of concerns: form logic + API logic + navigation
 */
export const useLogin = () => {
  // Form state management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Dependencies
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  // TanStack Query mutation using the HTTP class
  const loginMutation = useMutation<
    LoginResponse,
    LoginError,
    LoginCredentials
  >({
    mutationFn: async credentials => {
      const response = await http.post<LoginCredentials, LoginResponse>(
        '/auth/login',
        credentials
      );
      return response;
    },
    onSuccess: data => {
      const user: UserData = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };

      // Save tokens and user data in global auth store
      setAuth(data.accessToken, data.refreshToken, user);
    },
    onError: error => {
      console.error('Login failed:', error);
    },
    // Retry logic: only retry for network issues
    retry: (failureCount, error) => error.status === 0 && failureCount < 3,
  });

  // Form validation logic
  const validateForm = () => {
    if (!username.trim() && !password.trim()) {
      setFormError('Username & Password is required');
      return false;
    }
    if (!username.trim()) {
      setFormError('Username is required');
      return false;
    }
    if (!password.trim()) {
      setFormError('Password is required');
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          navigate('/profile');
        },
        onError: (error: LoginError) => {
          if (error.status === 401) {
            setFormError('Invalid username or password');
          } else if (error.status === 429) {
            setFormError('Too many attempts. Please try again later');
          } else {
            setFormError(error.message || 'An error occurred during login');
          }
        },
      }
    );
  };

  // Reset form
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setFormError('');
    loginMutation.reset(); // Reset mutation state
  };

  // Computed error message
  const errorMessage = loginMutation.error?.message || formError;

  return {
    // Form state
    username,
    setUsername,
    password,
    setPassword,
    formError,
    errorMessage,

    // TanStack Query states
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
    isSuccess: loginMutation.isSuccess,
    error: loginMutation.error,

    // Form actions
    handleSubmit,
    resetForm,

    // Direct mutation access for advanced use cases
    mutate: loginMutation.mutate,
    mutateAsync: loginMutation.mutateAsync,
  };
};
