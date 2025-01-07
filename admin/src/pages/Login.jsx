import { useState } from "react";
import LoginPNG from "../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/authSlice";
import { validateConfig } from "./ValidateConfig";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const { setAccessToken, setRefreshToken } = useAuthContext();
  const [login] = useLoginMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors({
      username: "",
      password: "",
    });
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // evaluate the the form data
  const validate = (fromData) => {
    const errorsData = {};

    Object.entries(fromData).forEach(([key, value]) => {
      validateConfig[key].some((rule) => {
        if (rule.required && !value) {
          errorsData[key] = rule.message;
          return true;
        }
      });
    });
    setErrors(errorsData);
    return errorsData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorsData = validate(formData);
    if (Object.keys(errorsData).length) return;

    login(formData)
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.data?.message);
        } else {
          const data = res?.data?.data;
          const access_token = data?.accessToken;
          const refresh_token = data?.refreshToken;
          toast.success(data?.message);
          localStorage.setItem("access_token", JSON.stringify(access_token));
          localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          toast.success(res.data.message);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  return (
    <div className="w-full md:h-[100vh] flex items-center justify-center">
      <div className="hidden md:block md:w-[50vw] h-full">
        <img
          className="w-full h-full object-cover "
          src={LoginPNG}
          alt="LoginPNG"
        />
      </div>
      <div className="w-full max-w-[70vw] h-[100vh]  md:w-[50vw] flex items-center justify-center ">
        <form
          action=""
          className="w-full md:max-w-[30vw] flex flex-col justify-between gap-4  px-4 py-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold ">Login</h1>

          <div className=" flex flex-col items-start justify-between gap-2">
            <label
              htmlFor="fullName"
              className="text-1.5xl font-medium color-[#ccc] "
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="border-2 rounded-md py-1 px-2 w-full placeholder:text-slate-400 placeholder:text-sm "
              placeholder="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.username}
              </p>
            )}
          </div>
          <div className=" flex flex-col items-start justify-between gap-2">
            <label
              htmlFor="password"
              className="text-1.5xl font-medium color-[#ccc] "
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 rounded-md py-1 px-2 w-full "
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.password}
              </p>
            )}
          </div>
          <div className=" flex flex-col items-start justify-between gap-2">
            <button className="w-full bg-black text-slate-100 py-1 rounded-md ">
              Login
            </button>
          </div>
          <div className=" text-center">
            <span>
              Not registered yet?{" "}
              <Link to="/signup" className="text-blue-900">
                Create account.
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
