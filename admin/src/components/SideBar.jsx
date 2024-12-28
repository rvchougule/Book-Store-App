import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  ChartBarStackedIcon,
  List,
  ListChecks,
  MessageSquareDiff,
} from "lucide-react";

const menu = [
  {
    icon: <MessageSquareDiff />,
    name: "Add Items",
    path: "/add-items",
  },
  {
    icon: <List />,
    name: "List Items",
    path: "/list-items",
  },
  {
    icon: <ListChecks />,
    name: "Orders",
    path: "/orders",
  },
];
function SideBar() {
  return (
    <div className="h-[64px] w-full flex justify-between sm:justify-start sm:flex-col sm:h-[100vh] sm:w-52 sm:shrink-0 overflow-hidden bg-white  ">
      <div className=" p-2 sm:p-4 flex gap-2 sm:my-4 cursor-pointer">
        <img src={logo} alt="" className="h-[2rem] sm:w-[3rem]" />
        <h6 className="text-lg sm:text-2xl font-bold text-[#452372]">Bacala</h6>
      </div>
      <p className="sm:text-md font-bold px-2 text-slate-500 border-b-2 border-[#452372]">
        Books
      </p>
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

      <p className="sm:text-md font-bold px-2 text-slate-500 border-b-2 border-[#452372]">
        Category
      </p>
      <NavLink
        to="/category"
        className={({ isActive }) =>
          `flex items-center justify-start  gap-2 my-2 py-2 sm:pl-12 ${
            isActive
              ? "bg-[#4523723e] text-[#452372] border-r-4 border-[#452372]"
              : ""
          }`
        }
      >
        <ChartBarStackedIcon />
        <span className="font-semibold text-xs">Category</span>
      </NavLink>
    </div>
  );
}

export default SideBar;
