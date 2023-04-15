import { Router } from "express";
import {
  handleCreateRunnerForATeam,
  handleDeleteOneTeam,
  handleDeleteRunnerFromTeamById,
  handleGetOneTeam,
  handleGetRunnerFromTeamById,
  handleGetRunnersOfATeam,
  handleGetStages,
  handleLogin,
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

export default router;
