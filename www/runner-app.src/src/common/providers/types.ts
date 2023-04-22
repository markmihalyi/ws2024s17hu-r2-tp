type Team = {
  id: number;
  name: string;
  contactEmail: string;
  location: string;
  plannedStartingTime: string;
  startingTime: string | null;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  speed: string;
  token: string;
  isAdmin: boolean;
  teamId: number;
  team: Team;
};

export type State =
  | "beforeRace"
  | "beforeStart"
  | "afterStart"
  | "runnerFinished"
  | "teamFinished";

export type TDataContext = {
  user: User | null | undefined;
  currentState: State | undefined;
  daysUntilEvent: number | undefined;
  currentRunner: CurrentRunner | undefined;
  nextRun: NextRun | undefined;
  fetchCurrentRunner: () => Promise<void>;
  fetchNextRun: () => Promise<void>;
};

type Stage = {
  id: number;
  startingLocation: string;
  arrivalLocation: string;
  distance: number;
  name: string;
};

type Runner = {
  id: number;
  firstName: string;
  lastName: string;
  speed: string;
  token: string;
  isAdmin: boolean;
  teamId: number;
};

export type NextRun = {
  stage: Stage;
  previousRunner: Runner | null;
  nextRunner: Runner | null;
  canStart: boolean;
  plannedStartTime: string;
  plannedFinishTime: string;
};

export type CurrentRunner = {
  runner: Runner;
  stage: Stage;
  scheduleDifference: number;
};
