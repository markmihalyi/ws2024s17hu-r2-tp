import axios from "axios";
import React from "react";
import useData from "../common/hooks/useData";

const AfterStart = () => {
  const { user, currentRunner, nextRun, fetchCurrentRunner, fetchNextRun } =
    useData();

  React.useEffect(() => {
    setInterval(async () => {
      await fetchCurrentRunner();
      await fetchNextRun();
    }, 5000);
  }, []);

  const [currentInterval, setCurrentInterval] = React.useState(
    setInterval(() => {}, 1000)
  );

  React.useEffect(() => {
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    if (nextRun) {
      const interval = setInterval(() => {
        const currentDate = new Date();
        const plannedStartTime = new Date(nextRun.plannedStartTime);

        const hours = Math.abs(
          plannedStartTime.getHours() - currentDate.getHours()
        )
          .toString()
          .padStart(2, "0");
        const minutes = Math.abs(
          plannedStartTime.getMinutes() - currentDate.getMinutes()
        )
          .toString()
          .padStart(2, "0");
        const seconds = Math.abs(
          plannedStartTime.getSeconds() - currentDate.getSeconds()
        )
          .toString()
          .padStart(2, "0");

        setTimeUntilHandover(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      setCurrentInterval(interval);
    }
  }, [nextRun]);

  const [timeUntilHandover, setTimeUntilHandover] =
    React.useState<string>("00:00:00");

  if (!currentRunner || !user) return null;

  const scheduleDifference = new Date(
    Math.abs(currentRunner.scheduleDifference * 1000)
  )
    .toISOString()
    .substring(11, 19);
  const aheadOfSchedule = currentRunner.scheduleDifference < 0;

  if (!nextRun) return null;

  const plannedStartTime = new Date(nextRun.plannedStartTime)
    .toISOString()
    .substring(11, 16);
  const plannedFinishTime = new Date(nextRun.plannedFinishTime)
    .toISOString()
    .substring(11, 16);

  const handleHandoverStart = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/handover/start",
        { stageId: nextRun.stage.id },
        { headers: { Authorization: "Bearer " + token } }
      );
      await fetchCurrentRunner();
      await fetchNextRun();
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  const handleHandoverFinish = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/handover/finish",
        { stageId: nextRun.stage.id },
        { headers: { Authorization: "Bearer " + token } }
      );
      await fetchCurrentRunner();
      await fetchNextRun();
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  return (
    <>
      {/* CURRENT RUNNER */}
      <span className="font-bold text-lg mt-3">Current runner</span>
      <div className="bg-gradient-to-r from-pink to-purple-2 rounded-2xl px-6 py-4 text-white mt-0.5 flex flex-col font-medium text-lg space-y-3">
        <div className="flex items-center">
          <i className="far fa-user mr-5"></i>
          {currentRunner.runner.firstName} {currentRunner.runner.lastName}
        </div>

        <div className="flex items-center">
          <i className="far fa-map mr-4"></i>
          <div className="flex flex-col text-sm">
            <span>{currentRunner.stage.startingLocation}</span>
            <span>{currentRunner.stage.arrivalLocation}</span>
          </div>
        </div>

        <div className="flex items-center">
          <i className="far fa-clock mr-4"></i>
          <div className="flex flex-col">
            <span>{scheduleDifference}</span>
            <span className="text-sm">
              {aheadOfSchedule ? "ahead" : "behind"} of schedule
            </span>
          </div>
        </div>
      </div>

      {currentRunner.runner.id !== user.id && (
        <>
          <span className="font-bold text-xl text-gray-1 mt-2">
            Your next {nextRun.stage.distance}km run 🏃
          </span>

          <span className="text-lg font-medium text-blue-1">
            {timeUntilHandover} UNTIL HANDOVER
          </span>
        </>
      )}

      {/* PREVIOUS STAGE */}
      {nextRun.previousRunner === null ? (
        <div className="mt-4 bg-light px-4 py-3 flex flex-col rounded-2xl">
          <span className="text-lg font-bold">
            {nextRun.stage.startingLocation}{" "}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-blue-1 border border-blue-1 py-1 px-4  rounded-3xl">
              <i className="far fa-user mr-2"></i>
              {user.firstName} {user.lastName}
            </span>

            <span className="text-center font-extrabold text-3xl my-6">
              {plannedStartTime}
            </span>
          </div>

          <button
            className="rounded-3xl bg-gray-200 text-gray-400 py-2.5 font-medium text-lg"
            disabled
          >
            <i className="far fa-check-circle mr-2"></i> Handover now
          </button>
        </div>
      ) : (
        <div className="mt-4 bg-light px-4 py-3 flex flex-col rounded-2xl">
          <span className="text-lg font-bold">
            {nextRun.stage.startingLocation}{" "}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-blue-1 border border-blue-1 py-1 px-4  rounded-3xl">
              <i className="far fa-user mr-2"></i>
              {nextRun.previousRunner?.firstName}{" "}
              {nextRun.previousRunner?.lastName}
            </span>

            <span className="text-center font-extrabold text-3xl my-6">
              {plannedStartTime}
            </span>
          </div>

          {nextRun.canStart ? (
            <button
              className="rounded-3xl bg-blue-1 text-white py-2.5 font-medium text-lg"
              onClick={handleHandoverStart}
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          ) : (
            <button
              className="rounded-3xl bg-gray-200 text-gray-400 py-2.5 font-medium text-lg"
              disabled
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          )}
        </div>
      )}

      {/* NEXT STAGE */}
      {nextRun.nextRunner === null ? (
        <div className="mt-4 bg-light px-4 py-3 flex flex-col rounded-2xl">
          <span className="text-lg font-bold">
            {nextRun.stage.arrivalLocation}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-center font-extrabold text-3xl my-6">
              {plannedFinishTime}
            </span>

            <span className="text-blue-1 border border-blue-1 py-1 px-4  rounded-3xl">
              <i className="far fa-user mr-2"></i>
              {user.firstName} {user.lastName}
            </span>
          </div>
          {currentRunner.runner.id === user.id ? (
            <button
              className="rounded-3xl bg-blue-1 text-white py-2.5 font-medium text-lg"
              onClick={handleHandoverFinish}
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          ) : (
            <button
              className="rounded-3xl bg-gray-200 text-gray-400 py-2.5 font-medium text-lg"
              disabled
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 bg-light px-4 py-3 flex flex-col rounded-2xl">
          <span className="text-lg font-bold">
            {nextRun.stage.arrivalLocation}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-center font-extrabold text-3xl my-6">
              {plannedFinishTime}
            </span>

            <span className="text-blue-1 border border-blue-1 py-1 px-4  rounded-3xl">
              <i className="far fa-user mr-2"></i>
              {nextRun.nextRunner?.firstName} {nextRun.nextRunner?.lastName}
            </span>
          </div>

          {currentRunner.runner.id === user.id ? (
            <button
              className="rounded-3xl bg-blue-1 text-white py-2.5 font-medium text-lg"
              onClick={handleHandoverFinish}
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          ) : (
            <button
              className="rounded-3xl bg-gray-200 text-gray-400 py-2.5 font-medium text-lg"
              disabled
            >
              <i className="far fa-check-circle mr-2"></i> Handover now
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default AfterStart;
