import axios from "axios";
import { useEffect, useState } from "react";
import useData from "../common/hooks/useData";
import { NextRun, Runner, Stage } from "./BeforeRace";

type CurrentRunner = {
  runner: Runner;
  stage: Stage;
  scheduleDifference: number;
};

const AfterStart = () => {
  const { user } = useData();

  const [currentRunner, setCurrentRunner] = useState<
    CurrentRunner | null | undefined
  >();

  const updateCurrentRunner = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/currentRunner", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.data.finished) {
        setCurrentRunner(null);
      } else {
        setCurrentRunner(res.data as CurrentRunner);
      }
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }
  };

  const [nextRun, setNextRun] = useState<NextRun | null | undefined>();
  const updateNextRunner = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/nextRun", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.data.finished) {
        setNextRun(null);
      } else {
        setNextRun(res.data as NextRun);
      }
    } catch (err) {
      alert("Unknown error occured.");
      window.location.reload();
    }
  };

  useEffect(() => {
    updateCurrentRunner();
    updateNextRunner();

    setInterval(() => {
      updateCurrentRunner();
      updateNextRunner();
    }, 5000);
  }, []);

  const [timeUntilHandover, setTimeUntilHandover] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>();

  const [currentInterval, setCurrentInterval] = useState(
    setInterval(() => {}, 1000)
  );

  useEffect(() => {
    clearInterval(currentInterval);

    if (nextRun?.plannedStartTime) {
      const interval = setInterval(() => {
        const currentDate = new Date();
        const handoverDate = new Date(nextRun.plannedStartTime);

        const diffMs = Math.abs(Number(handoverDate) - Number(currentDate));
        const hours = Math.floor(diffMs / 1000 / 60 / 60);
        const minutes = Math.floor((diffMs / 1000 / 60) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);

        const hoursFormatted = hours < 10 ? "0" + hours : hours;
        const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
        const secondsFormatted = seconds < 10 ? "0" + seconds : seconds;

        // DEBUG
        // console.log(
        //   nextRun?.plannedStartTime,
        //   hoursFormatted,
        //   minutesFormatted,
        //   secondsFormatted
        // );

        setTimeUntilHandover({
          hours: String(hoursFormatted),
          minutes: String(minutesFormatted),
          seconds: String(secondsFormatted),
        });
      }, 1000);
      setCurrentInterval(interval);
    }
  }, [nextRun?.plannedStartTime]);

  if (nextRun === undefined || currentRunner === undefined) return null;

  const scheduleAhead = currentRunner
    ? currentRunner?.scheduleDifference < 0
    : false;
  const scheduleDifference = Math.abs(currentRunner?.scheduleDifference || 0);
  const scheduleDiffHours = Math.floor(scheduleDifference / 60 / 60);
  const scheduleDiffMinutes = Math.floor((scheduleDifference / 60) % 60);
  const scheduleDiffSeconds = Math.floor(scheduleDifference % 60);
  const scheduleDiffHoursFormatted =
    scheduleDiffHours < 10 ? "0" + scheduleDiffHours : scheduleDiffHours;
  const scheduleDiffMinutesFormatted =
    scheduleDiffMinutes < 10 ? "0" + scheduleDiffMinutes : scheduleDiffMinutes;
  const scheduleDiffSecondsFormatted =
    scheduleDiffSeconds < 10 ? "0" + scheduleDiffSeconds : scheduleDiffSeconds;

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

  const handoverNowStart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/v1/handover/start",
        {
          stageId: nextRun?.stage.id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      updateCurrentRunner();
      updateNextRunner();
    } catch (err) {
      alert("Unknown error occured.");
      return;
    }
  };

  const handoverNowFinish = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/v1/handover/finish",
        {
          stageId: nextRun?.stage.id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      updateCurrentRunner();
      updateNextRunner();
    } catch (err) {
      alert("Unknown error occured.");
      return;
    }
  };

  if (currentRunner) {
    return (
      <>
        {/* current runner informations */}
        <span className="font-bold text-lg">Current runner</span>
        <div className="w-full bg-gradient-to-r from-pink to-purple-2 rounded-2xl flex flex-col px-6 text-white py-5 space-y-3 mt-2">
          <span className="text-xl font-medium">
            <i className="far fa-user mr-4"></i>{" "}
            {currentRunner.runner.firstName} {currentRunner.runner.lastName}
          </span>
          <div className="flex items-center">
            <span className="text-xl font-medium mr-4">
              <i className="far fa-map"></i> {/* missing map-marker icon */}
            </span>
            <div className="flex flex-col mr-4">
              <span>{currentRunner.stage.startingLocation}</span>
              <span>{currentRunner.stage.arrivalLocation}</span>
            </div>
            <span className="border-l border-white pl-3">
              {currentRunner.stage.distance} km
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-medium">
              <i className="far fa-clock mr-4"></i>
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-medium">
                {scheduleDiffHoursFormatted}:{scheduleDiffMinutesFormatted}:
                {scheduleDiffSecondsFormatted}
              </span>
              {scheduleDifference !== 0 && (
                <span className="text-sm">
                  {scheduleAhead ? "ahead" : "behind"} of schedule
                </span>
              )}
            </div>
          </div>
        </div>

        {nextRun ? (
          <>
            {/* time until next run */}
            {currentRunner.runner.id !== user?.id && (
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

            {/* stages */}
            <div className="mt-4 w-full bg-gray-1 rounded-2xl flex flex-col px-5 py-4">
              <span className="font-bold text-xl">
                {nextRun.stage.startingLocation}
              </span>
              <div className="w-full flex justify-between items-center mt-4 mb-6">
                <span className="px-4 py-1 rounded-3xl border border-blue-1 text-blue-1 text-lg font-medium">
                  <i className="far fa-user mr-3"></i>
                  {nextRun.previousRunner?.firstName || user?.firstName}{" "}
                  {nextRun.previousRunner?.lastName || user?.lastName}
                </span>

                <span className="font-extrabold text-3xl self-center">
                  {nextRunStartHoursFormatted}:{nextRunStartMinutesFormatted}
                </span>
              </div>

              {currentRunner.runner.id !== user?.id && nextRun.canStart ? (
                <button
                  className="bg-blue-1 w-full text-white py-2 rounded-3xl font-medium text-lg"
                  onClick={handoverNowStart}
                >
                  <i className="far fa-check-circle mr-2"></i> Handover now
                </button>
              ) : (
                <button
                  className="bg-gray-200 w-full text-gray-400 py-2 rounded-3xl font-medium text-lg"
                  disabled
                >
                  <i className="far fa-check-circle mr-2"></i> Handover now
                </button>
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

              {currentRunner.runner.id === user?.id ? (
                <button
                  className="bg-blue-1 w-full text-white py-2 rounded-3xl font-medium text-lg"
                  onClick={handoverNowFinish}
                >
                  <i className="far fa-check-circle mr-2"></i> Handover now
                </button>
              ) : (
                <button
                  className="bg-gray-200 w-full text-gray-400 py-2 rounded-3xl font-medium text-lg"
                  disabled
                >
                  <i className="far fa-check-circle mr-2"></i> Handover now
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="font-bold mt-3 text-lg">You are done!</span>
            <img src="images/finish.svg" alt="finish" />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-pink to-purple-2 text-white py-4 px-6 text-2xl font-medium">
        Race finished!
      </div>
      <span className="mt-3 font-bold text-lg">
        You are done! Congratulation!
      </span>
      <img src="images/finish.svg" alt="finish" />
    </>
  );
};

export default AfterStart;
