import { useContext } from 'react';
import { AdminContext } from './AdminContext';

export { AdminProvider } from './AdminContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
