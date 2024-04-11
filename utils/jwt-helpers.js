import jwt from "jsonwebtoken";

export const secretKey = "test";
function jwtTokens({ id, first_name }) {
  const user = { id, first_name };
  const accessToken = jwt.sign(user, secretKey, { expiresIn: "1h" });
  return accessToken;
}

export default jwtTokens;

