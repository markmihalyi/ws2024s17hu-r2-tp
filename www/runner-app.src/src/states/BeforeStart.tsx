import useData from "../common/hooks/useData";

const BeforeStart = () => {
  const { timeUntilEvent } = useData();

  const daysToGo = Math.ceil(timeUntilEvent / 1000 / 60 / 60 / 24);
  const firstDigit = daysToGo < 10 ? 0 : daysToGo.toString()[0];
  const secondDigit = daysToGo.toString()[0];

  return (
    <>
      <div className="flex items-center mt-4">
        <span className="px-3 pt-3 pb-4 bg-blue-1 rounded-xl text-white font-bold text-5xl mr-2">
          {firstDigit}
        </span>
        <span className="px-3 pt-3 pb-4 bg-blue-1 rounded-xl text-white font-bold text-5xl mr-6">
          {secondDigit}
        </span>
        <span className="text-3xl text-blue-1 font-bold">Days to go!</span>
      </div>

      <img className="mt-auto" src="images/runner.svg" alt="runner" />
    </>
  );
};

export default BeforeStart;
