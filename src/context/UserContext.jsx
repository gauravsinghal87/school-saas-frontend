import { createContext, useContext, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../hooks/useQueryMutations";
import { login } from "../api/apiMehods";
import { showSuccess } from "../utils/toast";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCurrentUser();

  // ✅ LOGIN FUNCTION HERE
  const handleLogin = async (payload) => {
    try {
      const res = await login(payload);
      if (res.success) {
        showSuccess('Login successful!');
        const { accessToken, refreshToken, user } = res.data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user?.role);
        queryClient.setQueryData(["me"], user);
      }
      return res;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    queryClient.clear();

    window.location.reload();
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isError,
      error,
      isFetching,
      refetch,
      login: handleLogin, // 👈 expose here
      logout,
      isAuthenticated: !!user,
    }),
    [user, isLoading, isError, error, isFetching]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};