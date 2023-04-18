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
};
