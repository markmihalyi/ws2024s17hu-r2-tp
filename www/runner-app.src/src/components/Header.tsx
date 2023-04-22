import useData from "../common/hooks/useData";

const Header = () => {
  const { user } = useData();

  return (
    <header className="bg-blue-2 text-white py-2 text-center font-medium text-lg">
      UB 2023 - {user?.team.name}
    </header>
  );
};

export default Header;
