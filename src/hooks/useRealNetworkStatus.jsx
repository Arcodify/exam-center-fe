// src/hooks/useRealNetworkStatus.js
import { useState, useEffect } from 'react';
import api from '../api/api';

export function useRealNetworkStatus(interval = 10000) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Replace this with your actual lightweight API route
        await api.get('/', { timeout: 5000 });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkConnection(); // Run immediately
    const intervalId = setInterval(checkConnection, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return isOnline;
}
