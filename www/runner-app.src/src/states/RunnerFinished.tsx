import React from "react";
import useData from "../common/hooks/useData";

const RunnerFinished = () => {
  const { currentRunner, fetchCurrentRunner } = useData();

  const [currentInterval, setCurrentInterval] = React.useState(
    setInterval(() => {}, 5000)
  );

  React.useEffect(() => {
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    const interval = setInterval(async () => {
      await fetchCurrentRunner();
    }, 5000);
    setCurrentInterval(interval);
  }, []);

  if (!currentRunner) return null;

  const scheduleDifference = new Date(
    Math.abs(currentRunner.scheduleDifference * 1000)
  )
    .toISOString()
    .substring(11, 19);
  const aheadOfSchedule = currentRunner.scheduleDifference < 0;

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

      {/* RUNNER FINISHED */}
      <span className="mt-3 font-bold text-lg text-gray-1">You are done!</span>

      <img src="images/finish.svg" alt="finish" />
    </>
  );
};

export default RunnerFinished;
