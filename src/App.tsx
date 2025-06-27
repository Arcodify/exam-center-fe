import Login from "@/pages/login";
import Signup from "@/pages/signup";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Dashboard from "./pages/dashboard";
import Questions from "./pages/questions";

function App() {
  return (
    <Routes>
      {/* Public Routes - Only accessible when NOT authenticated */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes - Only accessible when authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questions" element={<Questions />} />
      </Route>

      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
