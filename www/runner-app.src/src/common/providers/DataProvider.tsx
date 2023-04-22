import axios from "axios";
import React from "react";
import { CurrentRunner, NextRun, State, TDataContext, User } from "./types";

const DataContext = React.createContext<TDataContext>({} as TDataContext);

const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null | undefined>();
  const [currentState, setCurrentState] = React.useState<State | undefined>();
  const [daysUntilEvent, setDaysUntilEvent] = React.useState<
    number | undefined
  >();

  const [currentRunner, setCurrentRunner] = React.useState<CurrentRunner>();
  const [nextRun, setNextRun] = React.useState<NextRun>();

  const fetchCurrentRunner = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get("/currentRunner", {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.finished) {
        window.location.reload();
        return;
      }

      setCurrentRunner(data as CurrentRunner);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
      return;
    }
  };

  const fetchNextRun = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get("/nextRun", {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.finished) {
        window.location.reload();
        return;
      }

      setNextRun(data as NextRun);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }
  };

  const handleLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      await axios.post("/login", { token });
    } catch (err) {
      setUser(null);
      return;
    }

    localStorage.setItem("token", token);

    let finished = false;

    try {
      const { data } = await axios.get("/nextRun", {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.finished) {
        setCurrentState("runnerFinished");
        finished = true;
      }

      setNextRun(data as NextRun);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }

    try {
      const { data } = await axios.get("/currentRunner", {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.finished) {
        setCurrentState("teamFinished");
        finished = true;
      }

      setCurrentRunner(data as CurrentRunner);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }

    try {
      const res = await axios.get("/me", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = res.data as User;

      const plannedStartingTime = new Date(data.team.plannedStartingTime);
      const params = new URLSearchParams(window.location.search);
      const fakeDate = params.get("fakeDate");
      const currentDate = fakeDate ? new Date(fakeDate) : new Date();

      const timeDiffMs = Math.abs(
        Number(plannedStartingTime) - Number(currentDate)
      );
      const daysUntilEvent = Math.floor(timeDiffMs / 1000 / 60 / 60 / 24);
      setDaysUntilEvent(daysUntilEvent);

      if (!finished) {
        if (daysUntilEvent > 0) {
          setCurrentState("beforeRace");
        }

        const startingTime = data.team.startingTime;
        if (daysUntilEvent === 0) {
          if (startingTime === null) {
            setCurrentState("beforeStart");
          } else {
            setCurrentState("afterStart");
          }
        }
      }

      setUser(data as User);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }
  };

  React.useEffect(() => {
    handleLogin();
  }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        currentState,
        daysUntilEvent,
        currentRunner,
        nextRun,
        fetchCurrentRunner,
        fetchNextRun,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

export { DataProvider };
