import { useUser } from "@/hook/useUser";
import { useCallback, useLayoutEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const AuthorizeLayout = () => {
  const { isAuthenticated, loadUserFromStorage } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = useCallback(() => {
   
    // Wait for the userInfo to be set before calling isAuthenticated
    setTimeout(() => {
      const authenticated = isAuthenticated();
    
      setIsAuth(authenticated);
      setIsLoading(false);
    }, 0);
  }, [loadUserFromStorage, isAuthenticated]);
  
  useLayoutEffect(() => {
  
    checkAuth();
  }, []); // Empty dependency array - only run once on mount

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuth) {
  
    return <Navigate to="/login" replace />;
  }

 
  // Render protected content if authenticated
  return (
    <div className="bg-gray-100">
      <Outlet />
    </div>
  );
};

export default AuthorizeLayout;
