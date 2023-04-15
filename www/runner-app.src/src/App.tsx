import useData from "./common/hooks/useData";
import Header from "./components/Header";
import AfterStart from "./states/AfterStart";
import BeforeRace from "./states/BeforeRace";
import BeforeStart from "./states/BeforeStart";

const App = () => {
  const { user, currentState } = useData();

  if (user === undefined) {
    return (
      <main className="min-h-screen min-w-screen flex justify-center items-center text-2xl">
        Loading...
      </main>
    );
  }

  if (user === null) {
    return (
      <main className="min-h-screen min-w-screen flex justify-center items-center text-2xl">
        Invalid token provided.
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full h-[94vh] flex flex-col px-5">
        <h1 className="text-3xl font-bold mt-8">👋 Hi {user?.firstName}!</h1>
        <h2 className="mt-1 mb-2">Have a good running!</h2>

        {currentState === "beforeStart" && <BeforeStart />}
        {currentState === "beforeRace" && <BeforeRace />}
        {currentState === "afterStart" && <AfterStart />}
      </main>
    </>
  );
};

export default App;
