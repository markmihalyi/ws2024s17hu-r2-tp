import { Router } from "express";
import {
  handleCreateRunnerForATeam,
  handleDeleteOneTeam,
  handleDeleteRunnerFromTeamById,
  handleFinishHandover,
  handleGetCurrentRunner,
  handleGetMe,
  handleGetNextRun,
  handleGetOneTeam,
  handleGetRunnerFromTeamById,
  handleGetRunnersOfATeam,
  handleGetStages,
  handleLogin,
  handleStartHandover,
  handleUpdateOneTeam,
  handleUpdateRunnerInATeamById,
} from "../controllers/mainController.js";
import adminAuth from "../middlewares/adminAuth.js";
import userAuth from "../middlewares/userAuth.js";

const router = Router();

// Login
router.post("/login", handleLogin);

// Stages
router.get("/stages", handleGetStages);

// Teams
router.get("/teams/:teamId", userAuth, handleGetOneTeam);
router.put("/teams/:teamId", adminAuth, handleUpdateOneTeam);
router.delete("/teams/:teamId", adminAuth, handleDeleteOneTeam);

// Runners
router.get("/teams/:teamId/runners", userAuth, handleGetRunnersOfATeam);
router.post("/teams/:teamId/runners", adminAuth, handleCreateRunnerForATeam);
router.get(
  "/teams/:teamId/runners/:runnerId",
  userAuth,
  handleGetRunnerFromTeamById
);
router.put(
  "/teams/:teamId/runners/:runnerId",
  adminAuth,
  handleUpdateRunnerInATeamById
);
router.delete(
  "/teams/:teamId/runners/:runnerId",
  adminAuth,
  handleDeleteRunnerFromTeamById
);

// Schedules
router.get("/me", userAuth, handleGetMe);
router.get("/nextRun", userAuth, handleGetNextRun);
router.get("/currentRunner", userAuth, handleGetCurrentRunner);
router.post("/handover/start", userAuth, handleStartHandover);
router.post("/handover/finish", userAuth, handleFinishHandover);

export default router;
