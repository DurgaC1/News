import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CreditsContextType {
  credits: number;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

interface CreditsProviderProps {
  children: ReactNode;
}

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (user) {
      setCredits(user.credits);
    }
  }, [user]);

  const addCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const deductCredits = (amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount));
  };

  return (
    <CreditsContext.Provider value={{ credits, addCredits, deductCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

