import useData from "../common/hooks/useData";

const Header = () => {
  const { user } = useData();

  return (
    <header className="w-full bg-blue-2 text-white flex justify-center items-center py-2 font-medium text-lg">
      UB 2023 - {user?.team.name}
    </header>
  );
};

export default Header;
