import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("access_token")) || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    JSON.parse(localStorage.getItem("refresh_token")) || ""
  );

  const ClearStates = () => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    setAccessToken(null);
    setRefreshToken(null);
  };
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        ClearStates,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
