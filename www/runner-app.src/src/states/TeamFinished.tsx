const TeamFinished = () => {
  return (
    <>
      {/* RACE FINISHED */}
      <div className="bg-gradient-to-r from-pink to-purple-2 py-3.5 px-6 text-white font-medium rounded-2xl text-2xl mt-3">
        Race finished!
      </div>

      <span className="mt-2 font-bold text-lg text-gray-1">
        You are done! Congratulation!
      </span>

      <img src="images/finish.svg" alt="finish" />
    </>
  );
};

export default TeamFinished;
