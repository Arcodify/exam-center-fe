import React, { createContext, useContext, ReactNode } from 'react';

type HeaderContextType = {
  date: string;
  examTime: string;
  location: string;
  organizer: string;
};

const defaultHeaderData: HeaderContextType = {
  date: '2025/05/20 Tuesday',
  examTime: '7:30am to 8:30 am',
  location: 'Babarmahal, Kathmandu',
  organizer: 'NEPAL HEALTH PROFESSIONAL COUNCIL',
};

const HeaderContext = createContext<HeaderContextType>(defaultHeaderData);

export const useHeaderContext = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  return (
    <HeaderContext.Provider value={defaultHeaderData}>
      {children}
    </HeaderContext.Provider>
  );
};
