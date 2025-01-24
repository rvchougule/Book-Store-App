import { useEffect, useRef } from "react";
import { useRefreshTokenMutation } from "../store/authSlice";
import { useAuthContext } from "./useAuthContext";

function useRefreshToken() {
  const [fnRefreshToken] = useRefreshTokenMutation();
  const { setAccessToken, refreshToken, setRefreshToken, ClearStates } =
    useAuthContext();

  const flag = useRef(true);

  const refreshAccessToken = async () => {
    try {
      const res = await fnRefreshToken({ refreshToken });

      if (res.error) {
        // console.error(res);
        ClearStates();
        // navigate("/login");
      } else {
        const data = res?.data?.data;
        const access_token = data?.accessToken;
        const refresh_token = data?.refreshToken;

        localStorage.setItem("access_token", JSON.stringify(access_token));
        localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (refreshToken) {
      if (flag.current) {
        refreshAccessToken();
        flag.current = false;
      } else {
        setTimeout(() => {
          refreshAccessToken();
        }, 3600000);
      }
    }
  }, [refreshToken]); // Add dependencies

  return { refreshAccessToken }; // Return the function
}

export default useRefreshToken;
