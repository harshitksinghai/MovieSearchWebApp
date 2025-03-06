import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getUserID } from '../api/api'; // Import the getUserID function

interface AuthContextType {
  userId: string;
}


const AuthContext = createContext<AuthContextType>({
  userId: '',
});

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState('');

  // Initialize userId when the component mounts
  useEffect(() => {
    // Get or generate user ID
    const id = getUserID();
    setUserId(id);
    
    console.log('User ID initialized:', id);
  
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the search context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;