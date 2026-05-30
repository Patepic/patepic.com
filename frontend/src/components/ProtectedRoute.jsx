import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-slate-500 text-sm">
        Checking session…
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};
