import axios from "axios";
import React from "react";

type Team = {
  id: number;
  name: string;
  contactEmail: string;
  location: string;
  plannedStartingTime: string;
  startingTime: string | null;
};

type Props = {
  setShowConfirmationWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

const ManageTeam: React.FC<Props> = ({ setShowConfirmationWindow }) => {
  const [teamId, setTeamId] = React.useState<number>(-1);

  const [originalTeamData, setOriginalTeamData] = React.useState<Team | null>();

  const [teamName, setTeamName] = React.useState<string>("");
  const teamNameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setTeamName(e.currentTarget.value);
  };
  const [contactEmail, setContactEmail] = React.useState<string>("");
  const contactEmailChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setContactEmail(e.currentTarget.value);
  };
  const [location, setLocation] = React.useState<string>("");
  const locationChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setLocation(e.currentTarget.value);
  };

  const [inputChanged, setInputChanged] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (originalTeamData) {
      if (
        originalTeamData.name === teamName &&
        originalTeamData.contactEmail === contactEmail &&
        originalTeamData.location === location
      ) {
        setInputChanged(false);
      } else {
        setInputChanged(true);
      }
    }
  }, [teamName, contactEmail, location]);

  const loadTeamData = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("/api/v1/me", {
      headers: { Authorization: "Bearer " + token },
    });
    const team = res.data.team;
    setOriginalTeamData(team);
    setTeamId(team.id);
    setTeamName(team.name);
    setContactEmail(team.contactEmail);
    setLocation(team.location);
  };

  React.useEffect(() => {
    loadTeamData();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `/api/v1/teams/${teamId}`,
        {
          name: teamName,
          contactEmail,
          location,
        },
        { headers: { Authorization: "Bearer " + token } }
      );

      setOriginalTeamData(res.data as Team);
      setInputChanged(false);

      alert("The team's data has been updated.");
    } catch (err) {
      alert("Unknown error occured.");
    }
  };

  return (
    <div className="w-[20vw] flex flex-col">
      <h1 className="text-2xl font-medium mb-4">Manage your team</h1>
      <label htmlFor="teamName">Team name</label>
      <input
        className="border border-gray-500 rounded-md pl-2 py-1"
        type="text"
        value={teamName}
        onChange={teamNameChanged}
        id="teamName"
        aria-label="teamName"
      />
      <label className="mt-1" htmlFor="contactEmail">
        Contact email
      </label>
      <input
        className="border border-gray-500 rounded-md pl-2 py-1"
        type="email"
        value={contactEmail}
        onChange={contactEmailChanged}
        id="contactEmail"
        aria-label="contactEmail"
      />
      <label className="mt-1" htmlFor="location">
        Location
      </label>
      <input
        className="border border-gray-500 rounded-md pl-2 py-1"
        type="text"
        value={location}
        onChange={locationChanged}
        id="location"
        aria-label="location"
      />

      <div className="flex w-full justify-end mt-3 space-x-2">
        <button
          className="rounded-md bg-red-200 px-2 py-1 border border-red-500 font-medium"
          onClick={() => setShowConfirmationWindow(true)}
        >
          Delete team
        </button>
        {inputChanged ? (
          <button
            className="rounded-md bg-gray-200 px-2 py-1 border border-gray-500 font-medium"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="rounded-md bg-gray-200 px-2 py-1 border border-gray-500 font-medium text-gray-300"
            onClick={handleSave}
            disabled
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageTeam;
