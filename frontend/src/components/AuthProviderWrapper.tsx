// components/AuthProviderWrapper.tsx
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

export const AuthProviderWrapper = () => {
  return (
    <AuthProvider>
      <Outlet /> {/* Provides the children prop */}
    </AuthProvider>
  );
};