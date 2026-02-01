import User from "../models/User.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        "Login successful",
      ),
    );
  } else {
    res.json(new ApiError(401, "Invalid email or password"));
  }
});

export const signupController = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json(new ApiError(400, "User already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.json(
      new ApiResponse(
        201,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        "User created successfully",
      ),
    );
  } else {
    res.json(new ApiError(400, "Invalid user data"));
  }
});
