import { createContext, useContext, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../hooks/useQueryMutations";
import { login } from "../api/apiMehods";
import { showError, showSuccess } from "../utils/toast";

export const UserContext = createContext(null); // ✅ EXPORT HERE

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

      if (!res.success) {
        showError(error?.message || "Login failed. Please try again.");
        return
      }
      return res;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again ❌";


      showError(message); // 🔥 show toast

      throw new Error(message); // 🔥 IMPORTANT
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    queryClient.clear();
    // window.location.reload();
    console.log("Logged out, cache cleared, reloading...");
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isError,
      error,
      isFetching,
      refetch,
      login: handleLogin,
      logout,
      isAuthenticated: !!user,
    }),
    [user, isLoading, isError, error, isFetching, refetch, handleLogin, logout]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};



// hook