import db from "../db.js";

const userAuth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      status: "error",
      message: "Login required",
    });
  }

  const token = authorizationHeader.replace("Bearer", "").trim();
  if (isNaN(token)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid token provided",
    });
  }

  // Validate token
  db.query("SELECT * FROM runners WHERE token = ?", [token], (err, data) => {
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

    return next();
  });
};

export default userAuth;
