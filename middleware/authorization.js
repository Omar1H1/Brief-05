import jwt from "jsonwebtoken";
import { secretKey } from "../utils/jwt-helpers.js";

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.replace(/bearer /i, "");
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secretKey, (error, user) => {
    if (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

export default authenticateToken;
