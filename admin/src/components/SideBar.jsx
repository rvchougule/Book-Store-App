import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  ChartBarStackedIcon,
  CircleUserRound,
  CrossIcon,
  LibraryBigIcon,
  ListChecks,
} from "lucide-react";
import { useState } from "react";

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
      </div>
      {/* small device popup */}
      <div className="sm:hidden">
        <CircleUserRound className="m-4" onClick={() => setMenuBox(!menuBox)} />
        {menuBox && (
          <div className="absolute top-4 right-2 bg-[#cccccc7a]  rounded-md backdrop-blur-md">
            <div className="flex p-1 justify-end">
              <CrossIcon
                className="rotate-45 w-4 cursor-pointer"
                onClick={() => setMenuBox(!menuBox)}
              />
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
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
