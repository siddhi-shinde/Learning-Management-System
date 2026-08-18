import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  loginUser,
  logoutUser,
} from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // GET LOGGED-IN USER
  // ==============================
  const loadUser = async () => {
    try {
      const response = await getProfile();

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const login = async (data) => {
    const response = await loginUser(data);

    if (response.data.success) {
      setUser(response.data.user);
    }

    return response;
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};