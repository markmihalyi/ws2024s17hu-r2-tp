import axios from "axios";
import { useEffect, useState } from "react";
import useData from "../common/hooks/useData";

export type Stage = {
  id: number;
  startingLocation: string;
  arrivalLocation: string;
  distance: number;
  name: string;
};

export type Runner = {
  id: number;
  firstName: string;
  lastName: string;
  speed: string;
  token: string;
  isAdmin: boolean;
  teamId: number;
};

export type NextRun = {
  stage: Stage;
  previousRunner: Runner | null;
  nextRunner: Runner;
  canStart: boolean;
  plannedStartTime: string;
  plannedFinishTime: string;
};

const BeforeRace = () => {
  const { user } = useData();

  const raceBeginningDate = new Date(user?.team.plannedStartingTime || "");
  const raceBeginningHours =
    raceBeginningDate.getHours() < 10
      ? "0" + raceBeginningDate.getHours()
      : raceBeginningDate.getHours();
  const raceBeginningMinutes =
    raceBeginningDate.getMinutes() < 10
      ? "0" + raceBeginningDate.getMinutes()
      : raceBeginningDate.getMinutes();

  const [nextRun, setNextRun] = useState<NextRun | null>(null);

  const loadCurrentRun = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/nextRun", {
        headers: { Authorization: "Bearer " + token },
      });
      setNextRun(res.data as NextRun);
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }
  };

  useEffect(() => {
    loadCurrentRun();
  }, []);

  const [timeUntilHandover, setTimeUntilHandover] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>();

  setInterval(() => {
    if (nextRun) {
      const currentDate = new Date();
      const handoverDate = new Date(nextRun.plannedStartTime);

      const diffMs = Math.abs(Number(handoverDate) - Number(currentDate));
      const hours = Math.floor(diffMs / 1000 / 60 / 60);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      const hoursFormatted = hours < 10 ? "0" + hours : hours;
      const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
      const secondsFormatted = seconds < 10 ? "0" + seconds : seconds;

      setTimeUntilHandover({
        hours: String(hoursFormatted),
        minutes: String(minutesFormatted),
        seconds: String(secondsFormatted),
      });
    }
  }, 1000);

  const nextRunStartHours = new Date(
    nextRun?.plannedStartTime || ""
  ).getHours();
  const nextRunStartMinutes = new Date(
    nextRun?.plannedStartTime || ""
  ).getMinutes();
  const nextRunStartHoursFormatted =
    nextRunStartHours < 10 ? "0" + nextRunStartHours : nextRunStartHours;
  const nextRunStartMinutesFormatted =
    nextRunStartMinutes < 10 ? "0" + nextRunStartMinutes : nextRunStartMinutes;

  const nextRunFinishHours = new Date(
    nextRun?.plannedFinishTime || ""
  ).getHours();
  const nextRunFinishMinutes = new Date(
    nextRun?.plannedFinishTime || ""
  ).getMinutes();
  const nextRunFinishHoursFormatted =
    nextRunFinishHours < 10 ? "0" + nextRunFinishHours : nextRunFinishHours;
  const nextRunFinishMinutesFormatted =
    nextRunFinishMinutes < 10
      ? "0" + nextRunFinishMinutes
      : nextRunFinishMinutes;

  const startRace = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/v1/handover/start",
        {
          stageId: nextRun?.stage.id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      window.location.reload();
    } catch (err) {
      alert("Unknown error occured.");
      return;
    }
  };

  if (nextRun === null) return null;

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-pink to-purple-2 text-white py-4 px-6 text-2xl font-medium">
        Race begins at {raceBeginningHours}:{raceBeginningMinutes}!
      </div>

      {nextRun.stage.id === 1 && nextRun.canStart ? (
        <span className="mt-4 text-lg font-bold text-gray-2">
          Your first {nextRun.stage.distance} km run 🏃
        </span>
      ) : (
        <>
          <span className="mt-2 text-lg font-bold text-gray-2">
            Your next {nextRun.stage.distance} km run 🏃
          </span>
          {timeUntilHandover && (
            <span className="text-blue-1 text-lg font-medium">
              {timeUntilHandover?.hours}:{timeUntilHandover?.minutes}:
              {timeUntilHandover?.seconds} UNTIL HANDOVER
            </span>
          )}
        </>
      )}

      <div className="mt-2 w-full bg-gray-1 rounded-2xl flex flex-col px-5 py-4">
        {nextRun.previousRunner === null ? (
          <>
            <span className="font-bold text-xl">
              {nextRun.stage.startingLocation}
            </span>
            <span className="font-extrabold text-3xl self-center mt-3 mb-4">
              {nextRunStartHoursFormatted}:{nextRunStartMinutesFormatted}
            </span>

            {nextRun.canStart ? (
              <button
                className="bg-blue-1 w-full text-white py-2 rounded-3xl font-medium text-lg"
                onClick={startRace}
              >
                <i className="far fa-check-circle mr-2"></i> Start race
              </button>
            ) : (
              <button
                className="bg-gray-200 w-full text-gray-400 py-2 rounded-3xl font-medium text-lg"
                disabled
              >
                <i className="far fa-check-circle mr-2"></i> Start race
              </button>
            )}
          </>
        ) : (
          <>
            <span className="font-bold text-xl">
              {nextRun.stage.startingLocation}
            </span>
            <div className="w-full flex justify-between items-center mt-4 mb-6">
              <span className="px-4 py-1 rounded-3xl border border-blue-1 text-blue-1 text-lg font-medium">
                <i className="far fa-user mr-3"></i>
                {nextRun.previousRunner.firstName}{" "}
                {nextRun.previousRunner.lastName}
              </span>

              <span className="font-extrabold text-3xl self-center">
                {nextRunStartHoursFormatted}:{nextRunStartMinutesFormatted}
              </span>
            </div>

            <button
              className="bg-gray-200 w-full text-gray-400 py-2 rounded-3xl font-medium text-lg"
              disabled
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          </>
        )}
      </div>

      <div className="mt-3 w-full bg-gray-1 rounded-2xl flex flex-col px-5 py-4">
        <span className="font-bold text-xl">
          {nextRun.stage.arrivalLocation}
        </span>

        <div className="w-full flex justify-between items-center mt-4 mb-6">
          <span className="font-extrabold text-3xl self-center">
            {nextRunFinishHoursFormatted}:{nextRunFinishMinutesFormatted}
          </span>
          <span className="px-4 py-1 rounded-3xl border border-blue-1 text-blue-1 text-lg font-medium">
            <i className="far fa-user mr-3"></i>
            {nextRun.nextRunner.firstName} {nextRun.nextRunner.lastName}
          </span>
        </div>

        <button
          className="bg-gray-200 w-full text-gray-400 py-2 rounded-3xl font-medium text-lg"
          disabled
        >
          <i className="far fa-check-circle mr-2"></i> Handover now
        </button>
      </div>
    </>
  );
};

export default BeforeRace;
