const jwt = require("jsonwebtoken");
const UserSchema = require("../Schemas/UserSchema");
const ErrorHandler = require("./ErrorHandler");

const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login First", 409));
  }

  const decoded = jwt.verify(token, "manal");
  req.user = await UserSchema.findById(decoded._id);
  next();
};

module.exports = isAuth;
