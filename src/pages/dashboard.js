import { useEffect } from "react";
import Header from "../components/header";
import Timeline from "../components/timeline";
import Sidebar from "../components/sidebar";
import useUser from "../hooks/use-user";
import LoggedInUserContext from "../context/logged-in-user";

function Dashboard() {
  const { user } = useUser();

  useEffect(() => {
    document.title = "PostStorm";
  }, []);

  return (
    <LoggedInUserContext.Provider value={{ user }}>
      <div className="bg-white">
        <Header />
        <div className="bg-gray-background grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
          <Timeline />
          <Sidebar />
        </div>
      </div>
    </LoggedInUserContext.Provider>
  );
}

export default Dashboard;
