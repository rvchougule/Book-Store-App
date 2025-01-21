import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  ChartBarStackedIcon,
  CircleUserRound,
  CrossIcon,
  LibraryBigIcon,
  ListChecks,
  LogOutIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useGetCurrentUserQuery, useLogoutMutation } from "../store/authSlice";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";

const menu = [
  {
    icon: <LibraryBigIcon className="mx-2" />,
    name: "Books",
    path: "/list-items",
  },
  {
    icon: <ChartBarStackedIcon className="mx-2" />,
    name: "Category",
    path: "/category",
  },
  {
    icon: <ListChecks className="mx-2" />,
    name: "Orders",
    path: "/orders",
  },
];
function SideBar() {
  const [menuBox, setMenuBox] = useState(false);
  const { ClearStates } = useAuthContext();
  const { data, isFetching, isLoading } = useGetCurrentUserQuery();
  const userDetails = data?.data;

  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.data?.message);
        } else {
          const data = res?.data;
          toast.success(data?.message);
          ClearStates();
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };
  return (
    <div className="h-[64px] w-full flex justify-between sm:justify-start sm:flex-col sm:h-[100vh] sm:w-52 sm:shrink-0 overflow-hidden bg-white  ">
      <NavLink
        toto="/dashboard"
        className=" p-2 sm:p-4 flex gap-2 sm:my-4 cursor-pointer"
      >
        <img src={logo} alt="" className="h-[2rem] sm:w-[3rem]" />
        <h6 className="text-lg sm:text-2xl font-bold text-[#452372]">Bacala</h6>
      </NavLink>
      <div className="hidden sm:block">
        <div className="flex items-center justify-start  gap-2 my-1 py-1  ">
          {isFetching || isLoading ? (
            <ClipLoader
              color="#5b2fe0"
              size={35}
              className="w-10 h-10 m-4 rounded-full"
            />
          ) : userDetails ? (
            <img
              src={userDetails.avatar}
              alt="avatar"
              className="w-10 h-10 m-4 rounded-full border-2 border-[#5b2fe0]"
              onClick={() => setMenuBox(!menuBox)}
            />
          ) : (
            <CircleUserRound
              className="m-4"
              onClick={() => setMenuBox(!menuBox)}
            />
          )}
          <span className="font-semibold text-sm pr-2">{`${userDetails?.fullName}`}</span>
        </div>
        {menu.map((tab, i) => {
          return (
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center justify-start  gap-2 my-2 py-2 sm:pl-12 ${
                  isActive
                    ? "bg-[#4523723e] text-[#452372] border-r-4 border-[#452372]"
                    : ""
                }`
              }
              key={i}
            >
              {tab.icon}
              <span className="font-semibold text-xs">{tab.name}</span>
            </NavLink>
          );
        })}
        <div
          className="flex items-center justify-start  gap-2 my-1 py-1 sm:pl-12 "
          onClick={handleLogout}
        >
          {isLogoutLoading ? (
            <BeatLoader color="#5b2fe0" size={15} className="mx-auto" />
          ) : (
            <>
              <LogOutIcon className="mx-2 text-red-500" />
              <span className="font-semibold text-xs pr-2">Log out</span>
            </>
          )}
        </div>
      </div>
      {/* small device popup */}
      <div className="sm:hidden">
        {isFetching || isLoading ? (
          <ClipLoader
            color="#5b2fe0"
            size={35}
            className="w-10 h-10 m-4 rounded-full"
          />
        ) : userDetails ? (
          <img
            src={userDetails.avatar}
            alt="avatar"
            className="w-8 h-8 m-4 rounded-full border-2 border-[#5b2fe0]"
            onClick={() => setMenuBox(!menuBox)}
          />
        ) : (
          <CircleUserRound
            className="m-4"
            onClick={() => setMenuBox(!menuBox)}
          />
        )}
        {menuBox && (
          <div className="absolute top-4 right-2 bg-[#cccccc7a]  rounded-md backdrop-blur-md">
            <div className="flex p-1 justify-end">
              <CrossIcon
                className="rotate-45 w-4 cursor-pointer"
                onClick={() => setMenuBox(!menuBox)}
              />
            </div>
            <div className="flex items-center justify-start  gap-2 my-1 py-1 sm:pl-12 ">
              <CircleUserRound className="mx-2" />
              <span className="font-semibold text-xs pr-2">{`${userDetails?.fullName?.substring(
                0,
                16
              )}...`}</span>
            </div>
            {menu.map((tab, i) => {
              return (
                <NavLink
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex items-center justify-start  gap-2 my-1 py-1 sm:pl-12 ${
                      isActive
                        ? "bg-[#4523723e] text-[#452372] border-r-4 border-[#452372]"
                        : ""
                    }`
                  }
                  key={i}
                  onClick={() => setMenuBox(!menuBox)}
                >
                  {tab.icon}
                  <span className="font-semibold text-xs pr-2">{tab.name}</span>
                </NavLink>
              );
            })}
            <div
              className="flex items-center justify-start  gap-2 my-1 py-1 sm:pl-12 "
              onClick={handleLogout}
            >
              {isLogoutLoading ? (
                <BeatLoader color="#5b2fe0" size={15} className="mx-auto" />
              ) : (
                <>
                  <LogOutIcon className="mx-2 text-red-500" />
                  <span className="font-semibold text-xs pr-2">Log out</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
