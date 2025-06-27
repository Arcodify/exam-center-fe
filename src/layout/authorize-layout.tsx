import { Outlet, Navigate } from "react-router";
import { useUser } from "@/hook/useUser";
import { useLayoutEffect, useState, useCallback } from "react";

const AuthorizeLayout = () => {
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
    console.log("🚀 AuthorizeLayout mounted, checking auth...");
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
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Authenticated, rendering protected content");
  // Render protected content if authenticated
  return (
    <div className="bg-gray-100">
      <Outlet />
    </div>
  );
};

export default AuthorizeLayout;
