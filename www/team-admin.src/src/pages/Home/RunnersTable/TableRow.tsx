import axios from "axios";
import React from "react";
import { Runner } from ".";

type Props = {
  runner: Runner;
};

const TableRow: React.FC<Props> = ({ runner }) => {
  const [firstName, setFirstName] = React.useState<string>(runner.firstName);
  const firstNameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setFirstName(e.currentTarget.value);
  };
  const [lastName, setLastName] = React.useState<string>(runner.lastName);
  const lastNameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setLastName(e.currentTarget.value);
  };
  const [speed, setSpeed] = React.useState<string>(runner.speed);
  const speedChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setSpeed(e.currentTarget.value);
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(runner.token);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "/api/v1/teams/" + runner.teamId + "/runners/" + runner.id,
        { firstName, lastName, speed },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("The runner's data has been updated.");
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        "/api/v1/teams/" + runner.teamId + "/runners/" + runner.id,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("The runner has been deleted.");
      window.location.reload();
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        aria-label="firstName"
        className="flex-1 border-r border-gray-500 px-2 py-1"
        value={firstName}
        onChange={firstNameChanged}
      />
      <input
        type="text"
        aria-label="lastName"
        className="flex-1 border-r border-gray-500 px-2 py-1"
        value={lastName}
        onChange={lastNameChanged}
      />
      <input
        type="text"
        aria-label="speed"
        className="flex-1 border-r border-gray-500 px-2 py-1"
        value={speed}
        onChange={speedChanged}
      />
      <input
        type="text"
        aria-label="token"
        className="flex-1 border-r border-gray-500 px-2 py-1"
        value={runner.token}
        disabled
      />

      <div className="w-[8vw] flex justify-between items-center px-4 py-2">
        <button
          className="text-sm rounded-full p-2 flex items-center justify-center bg-gray-200"
          aria-label="copy"
          onClick={handleCopy}
        >
          <i className="fa fa-copy"></i>
        </button>
        <button
          className="text-sm rounded-full p-2 flex items-center justify-center bg-gray-200"
          aria-label="save"
          onClick={handleSave}
        >
          <i className="fa fa-save"></i>
        </button>
        <button
          className="text-sm rounded-full p-2 flex items-center justify-center bg-red-200 text-red-800"
          aria-label="delete"
          onClick={handleDelete}
        >
          <i className="fa fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default TableRow;
