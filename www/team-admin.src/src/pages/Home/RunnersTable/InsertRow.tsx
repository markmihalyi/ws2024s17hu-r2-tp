import axios from "axios";
import React from "react";
import { Runner } from ".";

type Props = {
  teamId: number;
};

const InsertRow: React.FC<Props> = ({ teamId }) => {
  const [firstName, setFirstName] = React.useState<string>("");
  const firstNameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setFirstName(e.currentTarget.value);
  };
  const [lastName, setLastName] = React.useState<string>("");
  const lastNameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setLastName(e.currentTarget.value);
  };
  const [speed, setSpeed] = React.useState<string>("");
  const speedChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setSpeed(e.currentTarget.value);
  };
  const handleAdd = async () => {
    if (!firstName || !lastName || !speed) {
      alert("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/v1/teams/" + teamId + "/runners",
        { firstName, lastName, speed },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      alert("A new runner has been created.");
      window.location.reload();
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 border-r border-gray-500 px-2 py-1">
        <input
          type="text"
          aria-label="firstName"
          className="border border-gray-500 px-2 py-1 w-full rounded"
          value={firstName}
          onChange={firstNameChanged}
        />
      </div>
      <div className="flex-1 border-r border-gray-500 px-2 py-1">
        <input
          type="text"
          aria-label="lastName"
          className="border border-gray-500 px-2 py-1 w-full rounded"
          value={lastName}
          onChange={lastNameChanged}
        />
      </div>
      <div className="flex-1 border-r border-gray-500 px-2 py-1">
        <input
          type="text"
          aria-label="speed"
          className="border border-gray-500 px-2 py-1 w-full rounded"
          value={speed}
          onChange={speedChanged}
        />
      </div>
      <div className="flex-1 border-r border-gray-500 px-2 py-1" />

      <div className="w-[8vw] flex justify-end items-center px-4">
        <button
          className="text-sm rounded-full p-2 flex items-center justify-center bg-gray-200"
          aria-label="add"
          onClick={handleAdd}
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default InsertRow;
