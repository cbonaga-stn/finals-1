const { v7: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { firstName, lastName, mobileNumber, email, password, places } = req.body;   // Added firstName, lastName, and mobileNumber fields

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({   // Added firstName, lastName, and mobileNumber fields
    firstName,
    lastName,
    mobileNumber,
    email,
    image:
      "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_incoming&w=740&q=80",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.error("--- SIGNUP FAILED ---", err);

    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  console.log("Request body received:", req.body);   // log 1
  
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);   // log 2

  let existingUser;

  try {
    existingUser = await User.findOne({ email });   // query database for user by email
    console.log("User query result:", existingUser);   // log 3
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    console.log("Password mismatch for:", email);   // log 5
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  console.log("Login success for:", existingUser.email); // log 6
  res.json({
    message: "Logged in!",
    userId: existingUser.id,
    email: existingUser.email,
    firstName: existingUser.firstName,   // Added firstName to login response
    lastName: existingUser.lastName,     // Added lastName to login response  
    mobileNumber: existingUser.mobileNumber, // Added mobileNumber to login response
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
