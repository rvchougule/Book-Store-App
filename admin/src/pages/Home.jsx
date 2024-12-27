import { Outlet } from "react-router-dom";

import SideBar from "../components/SideBar";

function Home() {
  return (
    <>
      <main className="h-[100vh] flex items-start  bg-[#45237214]">
        <SideBar />
        <Outlet />
      </main>
    </>
  );
}

export default Home;
