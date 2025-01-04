import { Outlet } from "react-router-dom";

import SideBar from "../components/SideBar";

function Home() {
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
