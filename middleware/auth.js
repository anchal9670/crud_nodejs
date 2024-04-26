const jwt = require("jsonwebtoken");
require("dotenv").config();


const isAuth = async (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.body.token || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  // console.log(req.header('Authorization'));
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token missing"
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.userId;
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
        success: false,
        error: error.message || "Internal server error",
    });
  }
};

module.exports = { isAuth };