import { Outlet } from "react-router-dom";

import SideBar from "../components/SideBar";
import useRefreshToken from "../hooks/useRefreshToken";

function Home() {
  useRefreshToken();

  return (
    <>
      <main className="h-[100vh] flex flex-col sm:flex-row  items-start overflow-hidden bg-[#45237214]">
        <SideBar />
        <div className=" w-full h-[100vh] overflow-y-scroll scrollbar-hide">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Home;
