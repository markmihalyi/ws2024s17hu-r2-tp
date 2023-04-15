import axios from "axios";
import React from "react";
import { ReactNode, useEffect, useState } from "react";

type Team = {
  id: number;
  name: string;
  contactEmail: string;
  location: string;
  plannedStartingTime: string;
  startingTime: string | null;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  speed: string;
  token: string;
  isAdmin: boolean;
  teamId: number;
  team: Team;
};

type State = "beforeRace" | "beforeStart" | "afterStart";

type DataContextType = {
  user: User | null | undefined;
  currentState: State | null;
  timeUntilEvent: number;
};

const DataContext = React.createContext<DataContextType>({} as DataContextType);

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [currentState, setCurrentState] = useState<State | null>(null);
  const [timeUntilEvent, setTimeUntilEvent] = useState<number>(-1);

  const checkToken = async () => {
    const params = new URLSearchParams(document.location.search);
    const token = params.get("token") || localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      await axios.post("/api/v1/login", { token });
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    localStorage.setItem("token", token);

    try {
      const res = await axios.get("/api/v1/me", {
        headers: { Authorization: "Bearer " + token },
      });
      setUser(res.data);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }
  };

  const checkCurrentState = async () => {
    const params = new URLSearchParams(window.location.search);
    const fakeDate = params.get("fakeDate");
    const currentDate = fakeDate ? new Date(fakeDate) : new Date();
    const startDate = new Date(user?.team.plannedStartingTime || "");

    const diffTime = Math.abs(Number(startDate) - Number(currentDate));
    setTimeUntilEvent(diffTime);

    if (currentDate < startDate) {
      setCurrentState("beforeStart");
      return;
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    if (
      currentYear === startYear &&
      currentMonth === startMonth &&
      currentDay === startDay
    ) {
      if (user?.team.startingTime === null) {
        setCurrentState("beforeRace");
      } else {
        setCurrentState("afterStart");
      }
    }
  };

  React.useEffect(() => {
    if (user) {
      checkCurrentState();
    }
  }, [user]);

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <DataContext.Provider value={{ user, currentState, timeUntilEvent }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

export { DataProvider };
