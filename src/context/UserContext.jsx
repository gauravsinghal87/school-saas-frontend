import { createContext, useContext, useMemo } from "react";
import { useCurrentUser } from "../hooks/useQueryMutations";
import { useQueryClient } from "@tanstack/react-query";
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

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    queryClient.removeQueries();
    queryClient.resetQueries();
    // Force React refresh of auth state
    window.location.reload(); // ✅ safest fix (simple + reliable)
  };

  // 🧠 memoized value (performance)
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isError,
      error,
      isFetching,
      refetch,
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

// 🔥 custom hook
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};