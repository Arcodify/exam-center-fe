import { Outlet, Navigate } from "react-router";
import { useUser } from "@/hook/useUser";
import { useLayoutEffect, useState, useCallback } from "react";

const AuthLayout = () => {
  const { isAuthenticated, loadUserFromStorage } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = useCallback(() => {
    const userLoaded = loadUserFromStorage();
    console.log("📦 User loaded from storage:", userLoaded);
  
    // Wait for the userInfo to be set before calling isAuthenticated
    setTimeout(() => {
      const authenticated = isAuthenticated();
      console.log("🔐 Is authenticated:", authenticated);
      setIsAuth(authenticated);
      setIsLoading(false);
    }, 0);
  }, [loadUserFromStorage, isAuthenticated]);
  

  useLayoutEffect(() => {
    console.log("🚀 AuthLayout mounted, checking auth...");
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

  // Redirect to dashboard if already authenticated
  if (isAuth) {
    console.log("✅ Already authenticated, redirecting to dashboard");
    return <Navigate to="/" replace />;
  }

  console.log("👤 Not authenticated, showing auth pages");
  // Render auth pages if not authenticated
  return <Outlet />;
};

export default AuthLayout;
