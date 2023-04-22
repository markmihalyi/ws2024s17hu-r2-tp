import axios from "axios";
import React from "react";
import useData from "../common/hooks/useData";

const BeforeStart = () => {
  const { user, nextRun } = useData();

  const [timeUntilHandover, setTimeUntilHandover] =
    React.useState<string>("00:00:00");

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

        const handoverTimeISO = new Date(
          Number(plannedStartTime) - Number(currentDate)
        )
          .toISOString()
          .substring(11, 19);

        setTimeUntilHandover(handoverTimeISO);
      }, 1000);
      setCurrentInterval(interval);
    }
  }, [nextRun]);

  if (!user || !nextRun) return null;

  const startingTime = new Date(user.team.plannedStartingTime);
  const startingHours = startingTime.getHours().toString().padStart(2, "0");
  const startingMinutes = startingTime.getMinutes().toString().padStart(2, "0");

  const plannedStartTime = new Date(nextRun.plannedStartTime)
    .toISOString()
    .substring(11, 16);
  const plannedFinishTime = new Date(nextRun.plannedFinishTime)
    .toISOString()
    .substring(11, 16);

  const handleStartRace = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/handover/start",
        { stageId: nextRun.stage.id },
        { headers: { Authorization: "Bearer " + token } }
      );
      window.location.reload();
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  return (
    <>
      <div className="mt-3 px-5 py-4 text-white font-medium text-2xl bg-gradient-to-r from-pink to-purple-2 rounded-2xl mb-2">
        Race begins at {startingHours}:{startingMinutes}!
      </div>

      {nextRun.stage.id === 1 && nextRun.canStart ? (
        <span className="font-bold text-lg text-gray-1">
          Your first {nextRun.stage.distance}km run 🏃
        </span>
      ) : (
        <>
          <span className="font-bold text-xl text-gray-1">
            Your next {nextRun.stage.distance}km run 🏃
          </span>

          <span className="text-lg font-medium text-blue-1">
            {timeUntilHandover} UNTIL HANDOVER
          </span>
        </>
      )}

      {/* PREVIOUS STAGE */}
      {nextRun.stage.id === 1 && nextRun.canStart ? (
        <div className="mt-4 bg-light px-4 py-3 flex flex-col rounded-2xl">
          <span className="text-lg font-bold">
            {nextRun.stage.startingLocation}
          </span>

          <span className="text-center font-extrabold text-3xl my-6">
            {plannedStartTime}
          </span>

          <button
            className="rounded-3xl bg-blue-1 text-white py-2.5 font-medium text-lg"
            onClick={handleStartRace}
          >
            <i className="far fa-check-circle mr-2"></i> Start race
          </button>
        </div>
      ) : (
        <div className="mt-4 bg-light px-4 py-3 flex flex-col rounded-2xl">
          <span className="text-lg font-bold">
            {nextRun.stage.startingLocation}
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

          <button
            className="rounded-3xl bg-gray-200 text-gray-400 py-2.5 font-medium text-lg"
            disabled
          >
            <i className="far fa-check-circle mr-2"></i> Handover now
          </button>
        </div>
      )}

      {/* NEXT STAGE */}
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
            {nextRun.nextRunner?.firstName || user.firstName}{" "}
            {nextRun.nextRunner?.lastName || user.lastName}
          </span>
        </div>

        <button
          className="rounded-3xl bg-gray-200 text-gray-400 py-2.5 font-medium text-lg"
          disabled
        >
          <i className="far fa-check-circle mr-2"></i> Handover now
        </button>
      </div>
    </>
  );
};

export default BeforeStart;
