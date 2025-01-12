import { useState } from "react";
import LoginPNG from "../assets/login.png";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "../store/authSlice";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
import signUpValidation from "../validation/signUpValidation";

const fields = {
  username: "",
  password: "",
};
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...fields });
  const [errors, setErrors] = useState({ ...fields });

  const { setAccessToken, setRefreshToken } = useAuthContext();
  const [login] = useLoginMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...fields });
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    signUpValidation
      .validate(formData, { abortEarly: false })
      .then(() => {
        login(formData)
          .then((res) => {
            if (res.error) {
              toast.error(res?.error?.data?.message);
            } else {
              const data = res?.data?.data;
              const access_token = data?.accessToken;
              const refresh_token = data?.refreshToken;
              toast.success(data?.message);
              localStorage.setItem(
                "access_token",
                JSON.stringify(access_token)
              );
              localStorage.setItem(
                "refresh_token",
                JSON.stringify(refresh_token)
              );
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
      })
      .catch((err) => {
        const formattedErrors = err?.inner?.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });
  };

  return (
    <div className="w-full lg:h-[100vh] flex items-center justify-center">
      <div className="hidden lg:block lg:w-[50vw] w-full max-w-[70vw] h-full">
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
