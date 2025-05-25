import Instructions from '@/components/auth/InstructionList';
import LoginForm from '@/components/auth/LoginForm';
import React from 'react';

export const LoginPage = () => {
  return (
    <main
      className="flex flex-1 px-6 py-8 justify-center gap-6 
                 lg:flex-row flex-col lg:items-start items-center
                 max-w-7xl mx-auto"
    >
      <div className="w-full lg:w-1/2 max-w-md">
        <LoginForm />
      </div>
      <div className="w-full lg:w-1/2 max-w-2xl">
        <Instructions />
      </div>
    </main>
  );
};
