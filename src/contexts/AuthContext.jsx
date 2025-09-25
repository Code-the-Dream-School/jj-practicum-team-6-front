import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

export const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      const user = await getCurrentUser();
      if (!mounted) return;
      setCurrentUser(user);
    }
    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
