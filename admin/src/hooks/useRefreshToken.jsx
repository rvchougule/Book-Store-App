import { useEffect } from "react";
import { useRefreshTokenMutation } from "../store/authSlice";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

function useRefreshToken() {
  const [fnRefreshToken] = useRefreshTokenMutation();
  const { setAccessToken, refreshToken, setRefreshToken, setUserDetails } =
    useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Refresh token");
    fnRefreshToken(refreshToken)
      .then((res) => {
        if (res.error) {
          console.error(res?.error?.data?.message);
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("access_token");
          setUserDetails({});
          navigate("/login");
        } else {
          const data = res?.data?.data;
          const access_token = data?.accessToken;
          const refresh_token = data?.refreshToken;

          localStorage.setItem("access_token", JSON.stringify(access_token));
          localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          console.log(res?.data?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return true;
}

export default useRefreshToken;
