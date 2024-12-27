import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { List, ListChecks, MessageSquareDiff } from "lucide-react";

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
    <div className="h-[100vh] w-[20vw] overflow-hidden bg-white">
      <div className="p-4 flex gap-2 my-4 cursor-pointer">
        <img src={logo} alt="" className="w-[3rem]" />
        <h6 className="text-2xl font-bold text-[#452372]">Bacala</h6>
      </div>
      {menu.map((tab, i) => {
        return (
          <NavLink
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center justify-start gap-2 my-2 py-2 pl-12 ${
                isActive
                  ? "bg-[#4523723e] text-[#452372] border-r-4 border-[#452372]"
                  : ""
              }`
            }
            key={i}
          >
            {tab.icon}
            <span className="font-semibold">{tab.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

export default SideBar;
