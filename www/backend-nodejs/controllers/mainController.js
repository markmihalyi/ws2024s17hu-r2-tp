import db from "../db.js";

// LOGIN
const handleLogin = (req, res) => {
  const { token } = req.body;

  if (!token && isNaN(token)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid token provided",
    });
  }

  db.query(
    "SELECT id, firstName, lastName, token, isAdmin, speed, teamId FROM runners WHERE token = ?",
    [token],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      if (data.length == 0) {
        return res.status(401).json({
          status: "error",
          message: "Login failed",
        });
      }

      const user = data[0];
      user.isAdmin = Boolean(user.isAdmin);

      return res.status(200).json({
        status: "success",
        user,
      });
    }
  );
};

// STAGES
const handleGetStages = (req, res) => {
  db.query("SELECT * FROM stages", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    return res.status(200).json(data);
  });
};

// TEAMS
const handleGetOneTeam = (req, res) => {
  const { teamId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }

  db.query(
    "SELECT id, name, contactEmail, location, plannedStartingTime, startingTime FROM teams WHERE id = ?",
    [teamId],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const team = data[0];
      return res.status(200).json(team);
    }
  );
};

const handleUpdateOneTeam = async (req, res) => {
  const { teamId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }

  const { name, location, contactEmail } = req.body;
  if (!name || !location || !contactEmail) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data provided",
    });
  }

  const currentDate = new Date();

  await new Promise((resolve) => {
    db.query(
      "UPDATE teams SET name = ?, location = ?, contactEmail = ?, updated_at = ? WHERE id = ?",
      [name, location, contactEmail, currentDate, teamId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve();
      }
    );
  });

  db.query(
    "SELECT id, name, contactEmail, location, plannedStartingTime, startingTime FROM teams WHERE id = ?",
    [teamId],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const team = data[0];
      return res.status(200).json(team);
    }
  );
};

const handleDeleteOneTeam = async (req, res) => {
  const { teamId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }

  await new Promise((resolve) => {
    db.query("DELETE FROM teams WHERE id = ?", [teamId], (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const affectedRows = data.affectedRows;
      if (affectedRows == 0) {
        return res.status(400).json({
          status: "error",
          message: "Team does not exist",
        });
      }

      resolve();
    });
  });

  db.query("DELETE FROM runners WHERE teamId = ?", [teamId], (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    return res.status(200).json({ success: true });
  });
};

// RUNNERS
const handleGetRunnersOfATeam = (req, res) => {
  const { teamId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }

  db.query(
    "SELECT id, firstName, lastName, token, isAdmin, speed, teamId FROM runners WHERE teamId = ?",
    [teamId],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      data.forEach((runner) => {
        runner.isAdmin = Boolean(runner.isAdmin);
      });

      return res.status(200).json(data);
    }
  );
};

const handleCreateRunnerForATeam = async (req, res) => {
  const { teamId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }

  const { firstName, lastName, speed } = req.body;
  if (!firstName || !lastName || !speed) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data provided",
    });
  }

  const token = Math.random().toString().slice(2, 11);

  const currentDate = new Date();

  await new Promise((resolve) => {
    db.query(
      "INSERT INTO runners (firstName, lastName, speed, teamId, token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, speed, teamId, token, currentDate, currentDate],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  db.query(
    "SELECT id, firstName, lastName, token, isAdmin, speed, teamId FROM runners WHERE token = ?",
    [token],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const newRunner = data[0];
      newRunner.isAdmin = Boolean(newRunner.isAdmin);
      return res.status(200).json(newRunner);
    }
  );
};

const handleGetRunnerFromTeamById = (req, res) => {
  const { teamId, runnerId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }
  if (!runnerId || isNaN(runnerId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid runner id provided",
    });
  }

  db.query(
    "SELECT id, firstName, lastName, token, isAdmin, speed, teamId FROM runners WHERE teamId = ? AND id = ?",
    [teamId, runnerId],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      if (data.length == 0) {
        return res.status(400).json({
          status: "error",
          message: "No runner found",
        });
      }

      const runner = data[0];
      runner.isAdmin = Boolean(runner.isAdmin);
      return res.status(200).json(runner);
    }
  );
};

const handleUpdateRunnerInATeamById = async (req, res) => {
  const { teamId, runnerId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }
  if (!runnerId || isNaN(runnerId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid runner id provided",
    });
  }

  const { firstName, lastName, speed } = req.body;
  if (!firstName || !lastName || !speed) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data provided",
    });
  }

  const currentDate = new Date();

  await new Promise((resolve) => {
    db.query(
      "UPDATE runners SET firstName = ?, lastName = ?, speed = ?, updated_at = ? WHERE teamId = ? AND id = ?",
      [firstName, lastName, speed, currentDate, teamId, runnerId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve();
      }
    );
  });

  db.query(
    "SELECT id, firstName, lastName, token, isAdmin, speed, teamId FROM runners WHERE teamId = ? AND id = ?",
    [teamId, runnerId],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const runner = data[0];
      runner.isAdmin = Boolean(runner.isAdmin);
      return res.status(200).json(runner);
    }
  );
};

const handleDeleteRunnerFromTeamById = (req, res) => {
  const { teamId, runnerId } = req.params;
  if (!teamId || isNaN(teamId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid team id provided",
    });
  }
  if (!runnerId || isNaN(runnerId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid runner id provided",
    });
  }

  db.query(
    "DELETE FROM runners WHERE teamId = ? AND id = ?",
    [teamId, runnerId],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const affectedRows = data.affectedRows;
      if (affectedRows == 0) {
        return res.status(400).json({
          status: "error",
          message: "Runner does not exist",
        });
      }

      return res.status(200).json({ success: true });
    }
  );
};

///////////////
// SCHEDULES //
///////////////
const handleGetMe = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.replace("Bearer", "").trim();

  const runner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE token = ?",
      [token],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  const team = await new Promise((resolve) => {
    db.query(
      "SELECT id, name, contactEmail, location, plannedStartingTime, startingTime FROM teams WHERE id = ?",
      [runner.teamId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const team = data[0];
        team.plannedStartingTime = new Date(team.plannedStartingTime)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);

        if (team.startingTime !== null) {
          team.startingTime = new Date(team.startingTime)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19);
        }

        resolve(team);
      }
    );
  });

  return res.status(200).json({
    ...runner,
    team,
  });
};

const handleGetCurrentRunner = async (req, res) => {
  const currentRun = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE handoverTime IS NULL ORDER BY stage_id ASC LIMIT 1",
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const currentRun = data[0];
        resolve({
          runnerId: currentRun.runner_id,
          stageId: currentRun.stage_id,
        });
      }
    );
  });

  const currentRunner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE id = ?",
      [currentRun.runnerId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  const currentStage = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM stages WHERE id = ?",
      [currentRun.stageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const stage = data[0];
        resolve(stage);
      }
    );
  });

  // SCHEDULE DIFFERENCE
  const stageDataBeforeCurrentRun = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id < ?",
      [currentStage.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  if (stageDataBeforeCurrentRun.length === 0) {
    return res.status(200).json({
      runner: currentRunner,
      stage: currentStage,
      scheduleDifference: 0,
    });
  }

  const runnersBeforeCurrentRun = await new Promise((resolve) => {
    const runnerIDs = new Array(
      stageDataBeforeCurrentRun.map((stage) => stage.runner_id)
    ).toString();

    db.query(
      `SELECT * FROM runners WHERE id IN (${runnerIDs})`,
      [currentStage.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  const stagesBeforeCurrentRun = await new Promise((resolve) => {
    const stageIDs = new Array(
      stageDataBeforeCurrentRun.map((stage) => stage.stage_id)
    ).toString();

    db.query(
      `SELECT * FROM stages WHERE id IN (${stageIDs})`,
      [currentStage.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  let stageDataBeforeCurrentRunMs = 0;
  stageDataBeforeCurrentRun.forEach((s) => {
    const { runner_id: runnerId, stage_id: stageId } = s;

    const runner = runnersBeforeCurrentRun.find((r) => r.id === runnerId);
    const timePerKm = runner.speed.substring(0, 5);
    const [minutes, seconds] = timePerKm.split(":").map((d) => Number(d));
    const miliSecs = minutes * 1000 * 60 + seconds * 1000;

    const stage = stagesBeforeCurrentRun.find((s) => s.id === stageId);
    const distance = Number(stage.distance);

    const totalMiliSecs = miliSecs * distance;
    stageDataBeforeCurrentRunMs += totalMiliSecs;
  });

  const teamStartingTime = await new Promise((resolve) => {
    db.query(
      "SELECT startingTime FROM teams WHERE id = ?",
      [currentRunner.teamId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const { startingTime } = data[0];
        resolve(startingTime ? startingTime : new Date());
      }
    );
  });

  const plannedStartTime = new Date(
    Number(teamStartingTime) + stageDataBeforeCurrentRunMs
  );

  // analyze previous handoverTime from runner_stage table
  const previousStageData = stageDataBeforeCurrentRun.find(
    (s) => s.stage_id === currentStage.id - 1
  );
  const handoverTime = new Date(previousStageData.handoverTime);

  const scheduleDifference = Math.round(
    (Number(handoverTime) - Number(plannedStartTime)) / 1000
  );

  return res.status(200).json({
    runner: currentRunner,
    stage: currentStage,
    scheduleDifference,
  });
};

const handleGetNextRun = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.replace("Bearer", "").trim();

  const runner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE token = ?",
      [token],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  // STAGE
  const stageId = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE runner_id = ? AND handoverTime IS NULL ORDER BY stage_id ASC LIMIT 1",
      [runner.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const currentRun = data[0];
        resolve(currentRun.stage_id);
      }
    );
  });
  const stage = await new Promise((resolve) => {
    db.query("SELECT * FROM stages WHERE id = ?", [stageId], (err, data) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }

      const stage = data[0];
      resolve(stage);
    });
  });

  // PREVIOUS RUNNER
  const previousStageId = stageId - 1;
  const previousRunnerId = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id = ?",
      [previousStageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const currentRun = data[0];
        resolve(currentRun.runner_id);
      }
    );
  });
  const previousRunner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE id = ?",
      [previousRunnerId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  // NEXT RUNNER
  const nextStageId = stageId + 1;
  const nextRunnerId = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id = ?",
      [nextStageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const currentRun = data[0];
        resolve(currentRun.runner_id);
      }
    );
  });
  const nextRunner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE id = ?",
      [nextRunnerId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  // CAN START
  const canStart = await new Promise((resolve) => {
    db.query(
      "SELECT handoverTime FROM runner_stage WHERE stage_id = ?",
      [stageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const { handoverTime } = data[0];
        resolve(handoverTime === null ? false : true);
      }
    );
  });

  // PLANNED STARTING TIME
  const teamStartingTime = await new Promise((resolve) => {
    db.query(
      "SELECT startingTime FROM teams WHERE id = ?",
      [runner.teamId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const { startingTime } = data[0];
        resolve(startingTime === null ? new Date() : startingTime);
      }
    );
  });

  const stageDataBeforeNextRun = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id <= ? AND handoverTime IS NULL",
      [stage.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  const runnersBeforeNextRun = await new Promise((resolve) => {
    const runnerIDs = new Array(
      stageDataBeforeNextRun.map((stage) => stage.runner_id)
    ).toString();

    db.query(
      `SELECT * FROM runners WHERE id IN (${runnerIDs})`,
      [stage.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  const stagesBeforeNextRun = await new Promise((resolve) => {
    const stageIDs = new Array(
      stageDataBeforeNextRun.map((stage) => stage.stage_id)
    ).toString();

    db.query(
      `SELECT * FROM stages WHERE id IN (${stageIDs})`,
      [stage.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve(data);
      }
    );
  });

  let stagesBeforeNextRunTimeMs = 0;
  stageDataBeforeNextRun.forEach((s) => {
    const { runner_id, stage_id } = s;

    if (stage_id === stageId) return;

    const runner = runnersBeforeNextRun.find((r) => r.id === runner_id);
    const timePerKm = runner.speed.substring(0, 5);
    const [minutes, seconds] = timePerKm.split(":").map((d) => Number(d));
    const miliSecs = minutes * 1000 * 60 + seconds * 1000;

    const stage = stagesBeforeNextRun.find((s) => s.id === stageId);
    const distance = Number(stage.distance);

    const totalMiliSecs = miliSecs * distance;
    stagesBeforeNextRunTimeMs += totalMiliSecs;
  });

  const teamStartingTimeMs = Number(new Date(teamStartingTime));
  const plannedStartTime = new Date(
    teamStartingTimeMs + stagesBeforeNextRunTimeMs
  );

  const timePerKm = runner.speed.substring(0, 5);
  const [minutes, seconds] = timePerKm.split(":").map((d) => Number(d));
  const miliSecs = minutes * 1000 * 60 + seconds * 1000;
  const distance = Number(stage.distance);
  const totalMiliSecs = miliSecs * distance;
  const plannedFinishTime = new Date(Number(plannedStartTime) + totalMiliSecs);

  return res.status(200).json({
    stage,
    previousRunner,
    nextRunner,
    canStart,
    plannedStartTime,
    plannedFinishTime,
  });
};

const handleStartHandover = async (req, res) => {
  const { stageId, time } = req.body;
  if (!stageId) {
    return res.status(403).json({
      success: false,
      message: "Stage id required",
      description: "You need to send the id of the stage you try to hand over.",
    });
  }

  // RUNNER
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.replace("Bearer", "").trim();

  const runner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE token = ?",
      [token],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  const stageData = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id = ?",
      [stageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const stage = data[0];
        resolve(stage);
      }
    );
  });
  if (stageData.runner_id !== runner.id) {
    return res.status(200).json({
      success: false,
      message: "This is not your stage",
      description:
        "You need to send your next stage id in the handover request",
    });
  }

  if (stageId === 1) {
    const teamStartingTime = await new Promise((resolve) => {
      db.query(
        "SELECT startingTime FROM teams WHERE id = ?",
        [runner.teamId],
        (err, data) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: "Internal server error",
            });
          }

          const { startingTime } = data[0];
          resolve(startingTime);
        }
      );
    });

    if (teamStartingTime !== null) {
      return res.status(403).json({
        success: false,
        message: "The race already started",
        description:
          "You need to send the id of the stage you try to hand over, otherwise it will try to start the race.",
      });
    }

    const startingTime = new Date(time) || new Date();
    await new Promise((resolve) => {
      db.query(
        "UPDATE teams SET startingTime = ? WHERE id = ?",
        [startingTime, runner.teamId],
        (err, data) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: "Internal server error",
            });
          }

          resolve();
        }
      );
    });

    return res.status(200).json({
      success: true,
      message: "Race started",
    });
  }

  const previousStageData = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id = ?",
      [stageId - 1],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const stage = data[0];
        resolve(stage);
      }
    );
  });

  if (previousStageData.handoverTime !== null) {
    return res.status(200).json({
      success: false,
      message: "Already active",
      description: "The stage already have been started",
    });
  }

  const nextRun = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE runner_id = ? AND handoverTime IS NULL ORDER BY stage_id ASC LIMIT 1",
      [runner.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const nextRun = data[0];
        resolve(nextRun);
      }
    );
  });
  if (nextRun.stage_id !== stageId) {
    return res.status(200).json({
      success: false,
      message: "Not active yet",
      description:
        "You cannot start this stage, as this is not the next upcoming stage.",
    });
  }

  const handoverTime = new Date(time) || new Date();
  await new Promise((resolve) => {
    db.query(
      "UPDATE runner_stage SET handoverTime = ? WHERE stage_id = ?",
      [handoverTime, stageId - 1],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve();
      }
    );
  });

  return res.status(200).json({
    success: true,
    message: "Handover successful",
  });
};

const handleFinishHandover = async (req, res) => {
  const { stageId, time } = req.body;
  if (!stageId) {
    return res.status(403).json({
      success: false,
      message: "Stage id required",
      description: "You need to send the id of the stage you try to hand over.",
    });
  }

  // RUNNER
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.replace("Bearer", "").trim();

  const runner = await new Promise((resolve) => {
    db.query(
      "SELECT id, firstName, lastName, speed, token, isAdmin, teamId FROM runners WHERE token = ?",
      [token],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const runner = data[0];
        runner.isAdmin = Boolean(runner.isAdmin);
        runner.speed = String(runner.speed).substring(0, 5);
        resolve(runner);
      }
    );
  });

  // CURRENT RUN
  const currentRun = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE handoverTime IS NULL ORDER BY stage_id ASC LIMIT 1",
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const currentRun = data[0];
        resolve({
          runnerId: currentRun.runner_id,
          stageId: currentRun.stage_id,
        });
      }
    );
  });

  const stageData = await new Promise((resolve) => {
    db.query(
      "SELECT * FROM runner_stage WHERE stage_id = ?",
      [stageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        const stage = data[0];
        resolve(stage);
      }
    );
  });
  if (!stageData) {
    return res.status(403).json({
      success: false,
      message: "Stage id required",
      description: "You need to send the id of the stage you try to hand over.",
    });
  }
  if (stageData.runner_id !== runner.id) {
    return res.status(200).json({
      success: false,
      message: "This is not your stage",
      description:
        "You need to send your next stage id in the handover request",
    });
  }

  if (currentRun.stageId !== stageId) {
    return res.status(200).json({
      success: false,
      message: "Not active yet",
      description: "You cannot finish this stage, as this is not active.",
    });
  }

  const handoverTime = new Date(time) || new Date();
  await new Promise((resolve) => {
    db.query(
      "UPDATE runner_stage SET handoverTime = ? WHERE stage_id = ?",
      [handoverTime, stageId],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        resolve();
      }
    );
  });

  return res.status(200).json({
    success: true,
    message: "Handover successful",
  });
};

export {
  handleLogin,
  handleGetStages,
  handleGetOneTeam,
  handleUpdateOneTeam,
  handleDeleteOneTeam,
  handleGetRunnersOfATeam,
  handleCreateRunnerForATeam,
  handleGetRunnerFromTeamById,
  handleUpdateRunnerInATeamById,
  handleDeleteRunnerFromTeamById,
  handleGetMe,
  handleGetNextRun,
  handleGetCurrentRunner,
  handleStartHandover,
  handleFinishHandover,
};
