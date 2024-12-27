import { useState } from "react";
import LoginPNG from "../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignUpMutation } from "../store/authSlice";
import { validateConfig } from "./ValidateConfig";

export default function SignUp() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [signUp] = useSignUpMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const file = e.target.files?.[0];

    setErrors({
      fullName: "",
      username: "",
      email: "",
      password: "",
      avatar: "",
    });

    if (file) {
      console.log(file);
      setFormData((prevState) => ({ ...prevState, [name]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
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
        if (rule.minlength && value.length < rule.minlength) {
          errorsData[key] = rule.message;
          return true;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
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

    console.log(formData);

    const errorsData = validate(formData);
    if (Object.keys(errorsData).length) return;

    signUp(formData)
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.data?.message);
        } else {
          toast.success(res?.data?.data?.message);
          setErrors({
            fullName: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
          });
          navigate("/login");
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
      <div className="w-full max-w-[70vw] h-[90vh]  md:w-[50vw] flex items-center justify-center ">
        <form
          action=""
          className="w-full md:max-w-[30vw] flex flex-col justify-between gap-4  px-4 py-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold ">Sign Up</h1>
          <div className=" flex flex-col items-start justify-between gap-2">
            <label
              htmlFor="fullName"
              className="text-1.5xl font-medium color-[#ccc] "
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="border-2 rounded-md py-1 px-2 w-full placeholder:text-slate-400 placeholder:text-sm "
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {errors.fullName && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.fullName}
              </p>
            )}
          </div>
          <div className=" flex flex-col items-start justify-between gap-2">
            <label
              htmlFor="Email"
              className="text-1.5xl font-medium color-[#ccc] "
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border-2 rounded-md py-1 px-2 w-full placeholder:text-slate-400 placeholder:text-sm "
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.email}
              </p>
            )}
          </div>
          <div className=" flex  items-start justify-between gap-2">
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
          </div>
          <div className="flex gap-4 p-4 items-center justify-center bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Upload Avatar
            </h2>
            <div className="relative">
              <label
                htmlFor="avatar"
                className="cursor-pointer text-center flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 overflow-hidden border border-dashed border-gray-300 hover:bg-gray-300"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Choose a file</span>
                )}
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
          </div>
          {errors.avatar && (
            <p className="text-sm  text-red-500 font-semibold ">
              {errors.avatar}
            </p>
          )}

          <div className=" flex flex-col items-start justify-between gap-2">
            <button className="w-full bg-black text-slate-100 py-1 rounded-md ">
              Submit
            </button>
          </div>
          <div className=" text-center">
            <span>
              Already registred?{" "}
              <Link to="/login" className="text-blue-900">
                Login here.
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
