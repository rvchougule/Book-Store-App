import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router";

function Layout() {
  return (
    <div>
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
