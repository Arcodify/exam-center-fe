import { Outlet, Navigate } from "react-router-dom";

function RequireAuth() {
  // Check if the user is authenticated by looking in localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Replace with the data you store on login
  
  // If the user is not authenticated, redirect to login page
  return !user ? <Navigate to="/login" replace={true} /> : <Outlet />;
}

export default RequireAuth;
