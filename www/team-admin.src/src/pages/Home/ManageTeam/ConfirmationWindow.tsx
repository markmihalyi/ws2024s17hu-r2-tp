import axios from "axios";

type Props = {
  teamId: number;
  setShowConfirmationWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmationWindow: React.FC<Props> = ({
  teamId,
  setShowConfirmationWindow,
}) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/v1/teams/${teamId}`, {
        headers: { Authorization: "Bearer " + token },
      });

      alert("The team has been deleted.");

      localStorage.removeItem("token");
      window.location.replace("/login");
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  return (
    <div className="absolute w-[100vw] min-h-screen bg-white flex justify-center items-center bg-opacity-80">
      <div className="w-[20vw] flex flex-col justify-center border border-gray-500 rounded-lg px-8 py-5 bg-white">
        <h1 className="text-3xl font-medium">Are you sure?</h1>
        <p className="mt-4 text-sm mb-6">
          If you click on the delete button, your team and all runners belonging
          to your team will be deleted.
        </p>
        <div className="flex justify-between w-full">
          <button onClick={() => setShowConfirmationWindow(false)}>
            Cancel
          </button>
          <button
            className="border border-red-500 bg-red-200 rounded-md px-2 py-1 font-medium"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationWindow;
