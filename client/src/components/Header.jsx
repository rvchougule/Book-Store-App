import { assets } from "../assets/data";

import { TbHomeFilled } from "react-icons/tb";
import { IoLibrary } from "react-icons/io5";
import { IoMailOpen } from "react-icons/io5";
import { NavLink } from "react-router";
import { RiShoppingBag4Line } from "react-icons/ri";
import { RiUserLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FaRegWindowClose } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectTotalQuantity } from "../store/cartSliceReducer";
import { useGetCurrentUserQuery } from "../store/authSlice";
import ClipLoader from "react-spinners/ClipLoader";

const menu = [
  {
    link: "/",
    icon: <TbHomeFilled />,
    name: "Home",
  },
  {
    link: "/shop",
    icon: <IoLibrary />,
    name: "Shop",
  },
  {
    link: "/contact",
    icon: <IoMailOpen />,
    name: "Contact",
  },
];
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cartBooksCount = useSelector(selectTotalQuantity);
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isFetching: isFetchingInCurrentUser,
  } = useGetCurrentUserQuery();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={` fixed top-0 w-full left-0 right-0 z-50 ${
        !scrolled ? "bg-primary" : "bg-white"
      }`}
    >
      <div className="py-3 max-padd-container flexBetween border-b border-slate-900/10 rounded transition-all duration-300 ">
        <NavLink className="flex items-center justify-y-start ">
          <img
            className="hidden sm:block max-w-8"
            src={assets.logo}
            alt="log"
          />
          <h3 className="text-2xl font-bold">Bacala</h3>
        </NavLink>
        <nav className="hidden xl:flex xl-justify-center gap-x-8 xl:gap-x-14 medium-15 rounded-full px-2 py-1">
          {menu.map((item, i) => {
            return (
              <NavLink
                to={item.link}
                key={i}
                className={({ isActive }) => {
                  return `flexStart gap-2 ${isActive ? "active-link" : ""}`;
                }}
              >
                {item.icon} {item.name}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center justify-y-end gap-x-4">
          <CgMenuLeft
            className="text-2xl xl:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <NavLink
            to="/cart"
            className="flexCenter relative text-xl bg-[#452372] text-white rounded-full p-2"
          >
            <RiShoppingBag4Line />
            <span className="absolute -top-2 -right-1 bg-white text-black rounded-full text-sm px-1 border-1">
              {cartBooksCount || 0}
            </span>
          </NavLink>
          {isCurrentUserLoading || isFetchingInCurrentUser ? (
            <ClipLoader
              color="#452372"
              loading="true"
              size={35}
              aria-label="Loading Spinner"
              data-testid="loader"
              className=""
            />
          ) : currentUser ? (
            <div className="w-12 rounded-full overflow-hidden ring-2 ring-secondaryOne">
              <img src={currentUser?.data?.avatar} alt="" />
            </div>
          ) : (
            <NavLink
              to="/login"
              className="btn-outline flexCenter !border-none gap-x-2 "
            >
              <span className="">Login</span>
              <RiUserLine />
            </NavLink>
          )}
        </div>
      </div>

      {/* slidebar */}
      {open && (
        <div className="absolute top-0 left-0 w-40 h-[100vh] bg-white py-24 px-8 xl:hidden">
          <FaRegWindowClose
            className="absolute top-8 right-4 text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <NavLink className="flex items-center justify-y-start ">
            <img
              className="hidden sm:block max-w-8"
              src={assets.logo}
              alt="log"
            />
            <h3 className="text-2xl font-bold">Bacala</h3>
          </NavLink>
          <nav className=" flex flex-col items-start justify-center gap-8  medium-15 rounded-full px-2 py-4">
            {menu.map((item, i) => {
              return (
                <NavLink
                  to={item.link}
                  key={i}
                  className={({ isActive }) => {
                    return `flexStart gap-2 ${isActive ? "active-link" : ""}`;
                  }}
                  onClick={() => setOpen(!open)}
                >
                  {item.icon} {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
