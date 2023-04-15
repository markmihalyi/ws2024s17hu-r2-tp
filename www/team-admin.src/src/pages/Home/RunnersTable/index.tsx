import React from "react";
import axios from "axios";
import TableRow from "./TableRow";
import InsertRow from "./InsertRow";

type Props = {
  teamId: number;
};

export type Runner = {
  id: number;
  firstName: string;
  lastName: string;
  speed: string;
  token: string;
  isAdmin: boolean;
  teamId: number;
};

const RunnersTable: React.FC<Props> = ({ teamId }) => {
  const [runners, setRunners] = React.useState<Runner[]>([]);

  const loadRunners = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/v1/teams/" + teamId + "/runners", {
      headers: { Authorization: "Bearer " + token },
    });
    const runnersData = res.data as Runner[];
    setRunners(runnersData);
  };

  React.useEffect(() => {
    loadRunners();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-medium">Runners</h1>
        <a
          className="border border-gray-500 bg-gray-200 px-2 py-1 rounded-md font-medium"
          href="http://stage-planner.localhost"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa fa-list text-sm mr-1"></i> Stage Planner
        </a>
      </div>
      <div className="flex flex-col w-full border border-gray-500 mt-3">
        <div className="flex border-b border-gray-500">
          <div className="flex-1 border-r border-gray-500 px-2 py-1 font-medium">
            First Name
          </div>
          <div className="flex-1 border-r border-gray-500 px-2 py-1 font-medium">
            Last Name
          </div>
          <div className="flex-1 border-r border-gray-500 px-2 py-1 font-medium">
            Speed
          </div>
          <div className="flex-1 border-r border-gray-500 px-2 py-1 font-medium">
            Token
          </div>
          <div className="w-[8vw] border-gray-500 px-2 py-1 font-medium">
            Actions
          </div>
        </div>

        {runners.map((runner, index) => {
          return <TableRow key={index} runner={runner} />;
        })}

        {runners.length < 10 && <InsertRow teamId={teamId} />}
      </div>
    </div>
  );
};

export default RunnersTable;
