import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '~/store/session';

export const RequireAdmin: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, isInitialized, fetchSession } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      fetchSession();
    }
  }, [isInitialized, fetchSession]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Verifying administrator permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
