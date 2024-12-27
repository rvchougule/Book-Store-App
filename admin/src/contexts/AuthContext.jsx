import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("access_token")) || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    JSON.parse(localStorage.getItem("refresh_token")) || ""
  );

  const [userDetails, setUserDetails] = useState();

  // refresh token

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
