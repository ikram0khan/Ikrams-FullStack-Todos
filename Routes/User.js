const express = require("express");
const ErrorHandler = require("../middlewares/ErrorHandler");
const User = require("../Schemas/UserSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const isAuth = require("../middlewares/auth");
const UserSchema = require("../Schemas/UserSchema.js");
const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  const { name, email, password, photo } = req.body;
  let user = await UserSchema.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already Exists, Login Please"));
  }
  if (name === "" || email === "" || password === "") {
    return next(new ErrorHandler("Please Fill The Credentials", 401));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  // if (photo) {
  //   let buffer = Buffer.from(
  //     photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
  //     "base64"
  //   );
  //   const photoPath = `${Date.now()}-${"khan"}.png`;
  //   fs.writeFileSync(`storage/${photoPath}`, buffer);

  //   user = await User.create({
  //     name: name,
  //     email: email,
  //     photo: `http://localhost:7000/storage/${photoPath}`,
  //     password: hashedPassword,
  //   });
  //   let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETl);

  //   res
  //     .cookie("token", token, {
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 1000 * 36,
  //     })
  //     .status(201)
  //     .json({
  //       user,
  //       auth: true,
  //     });
  // } else {
  user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    photo: "",
  });

  let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETl);

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 36,
    })
    .status(201)
    .json({
      user,
      auth: true,
    });
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === "" || password === "") {
      return next(new ErrorHandler("Please Fill The Credentials", 409));
    }
    let user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User Does Not Exists"));
    }

    let passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(new ErrorHandler("Invalid Email Or Password", 409));
    }

    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETl);
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 36,
      })
      .status(200)
      .json({
        user,
        auth: true,
      });
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/logout", isAuth, async (req, res, next) => {
  res.clearCookie("token").status(200).json({
    message: "User Logged Out",
    auth: false,
  });
});

userRouter.put("/update", isAuth, async (req, res, next) => {
  const { name, photo } = req.body;

  // if (photo) {
  //   let buffer = Buffer.from(
  //     photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
  //     "base64"
  //   );
  //   const photoPath = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  //   fs.writeFileSync(`/storage/${photoPath}`, buffer);
  //   const user = await UserSchema.updateOne(
  //     { _id: req.user._id },
  //     {
  //       $put: {
  //         name: name,
  //         photo: `http://localhost:7000/storage/${photoPath}`,
  //       },
  //     }
  //   );
  //   res.status(200).json({
  //     auth: true,
  //     user: user,
  //     message: "User Updated",
  //   });
  // }
  const user = await UserSchema.updateOne(
    { _id: req.user._id },
    {
      $put: {
        name: name,
      },
    }
  );

  res.status(200).json({
    user: user,
    auth: true,
    message: "User Updated",
  });
});

userRouter.get("/me", async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login First, Unauhotrized", 409));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserSchema.findById(decoded._id);
  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 125,
    })
    .status(200)
    .json({
      user,
      auth: true,
    });
});
module.exports = userRouter;
