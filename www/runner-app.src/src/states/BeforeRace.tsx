import useData from "../common/hooks/useData";

const BeforeRace = () => {
  const { daysUntilEvent } = useData();

  const daysUntilEventString =
    daysUntilEvent?.toString().padStart(2, "0") || "";

  return (
    <>
      <div className="flex items-center mt-4">
        <div className="bg-blue-1 text-white font-bold text-5xl pt-3 pb-4 px-4 rounded-xl mr-2">
          {daysUntilEventString[0]}
        </div>
        <div className="bg-blue-1 text-white font-bold text-5xl pt-3 pb-4 px-4 rounded-xl mr-8">
          {daysUntilEventString[1]}
        </div>

        <span className="text-blue-1 font-bold text-3xl">Days to go!</span>
      </div>

      <img className="mt-auto" src="images/runner.svg" alt="runner" />
    </>
  );
};

export default BeforeRace;
