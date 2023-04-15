import axios from "axios";
import React from "react";
import ConfirmationWindow from "./ManageTeam/ConfirmationWindow";
import ManageTeam from "./ManageTeam/index";
import RunnersTable from "./RunnersTable/index";

const Home = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [teamId, setTeamId] = React.useState<number>(-1);

  const checkIfLoggedIn = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      window.location.replace("/login");
    }

    try {
      const res = await axios.post("/api/v1/login", { token: savedToken });
      setTeamId(res.data.user.teamId);
      setLoggedIn(true);
    } catch (err) {
      alert("The token is incorrect. Please log in.");
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
  };

  React.useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const [showConfirmationWindow, setShowConfirmationWindow] =
    React.useState<boolean>(false);

  if (!loggedIn)
    return (
      <main className="min-w-screen min-h-screen flex justify-center items-center text-3xl">
        Loading...
      </main>
    );

  return (
    <main className="relative min-w-screen min-h-screen flex justify-center items-center mx-6">
      {showConfirmationWindow && (
        <ConfirmationWindow
          teamId={teamId}
          setShowConfirmationWindow={setShowConfirmationWindow}
        />
      )}
      <div className="border border-gray-400 rounded-lg mx-auto flex flex-col px-8 py-6 w-full">
        <div className="flex justify-between w-full items-start">
          <ManageTeam setShowConfirmationWindow={setShowConfirmationWindow} />
          <button
            className="px-2 py-1 rounded-md bg-gray-200 border border-gray-500 font-medium"
            onClick={handleLogout}
          >
            <i className="fa fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
        <hr className="my-6" />
        <RunnersTable teamId={teamId} />
      </div>
    </main>
  );
};

export default Home;
