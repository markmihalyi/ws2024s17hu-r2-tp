import React from "react";
import useData from "./common/hooks/useData";
import Header from "./components/Header";
import AfterStart from "./states/AfterStart";
import BeforeRace from "./states/BeforeRace";
import BeforeStart from "./states/BeforeStart";
import RunnerFinished from "./states/RunnerFinished";
import TeamFinished from "./states/TeamFinished";

function App() {
  const { user, currentState } = useData();

  if (user === undefined) {
    return (
      <main className="min-w-screen min-h-screen flex justify-center items-center text-2xl">
        Loading...
      </main>
    );
  }

  if (user === null) {
    return (
      <main className="min-w-screen min-h-screen flex justify-center items-center text-2xl">
        Invalid token provided.
      </main>
    );
  }

  return (
    <>
      <Header />

      <main className="flex flex-col min-w-screen h-[90vh] px-6">
        <h1 className="mt-6 text-3xl font-bold">👋 Hi {user.firstName}!</h1>
        <h2 className="mt-1">Have a good running!</h2>

        {currentState === "beforeRace" && <BeforeRace />}
        {currentState === "beforeStart" && <BeforeStart />}
        {currentState === "afterStart" && <AfterStart />}
        {currentState === "runnerFinished" && <RunnerFinished />}
        {currentState === "teamFinished" && <TeamFinished />}
      </main>
    </>
  );
}

export default App;
