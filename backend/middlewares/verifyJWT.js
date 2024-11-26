import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ auth: false, message: "Token not provided" });
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .json({ auth: false, message: "Failed to authenticate token" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

export default verifyJWT;
