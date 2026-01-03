import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.js';
import { User } from '../models/modelsExport.js';
import appError from './../utils/appError.js';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPAIR_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exists in payload for client
  if (!email?.trim() || !password?.trim()) {
    return next(new appError('Please provide email and password.', 400));
  }

  // check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or password.', 401));
  }

  // if everything goes well, send the jwt token to client as response
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

export const Protected = catchAsync(async (req, res, next) => {
  // 1. Get the token and check if is exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // check if toke exists
  if (!token) {
    return next(
      new appError('You are not logged in, please login to get access.', 401)
    );
  }

  // 2. Verification of token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new appError('The user belonging to this token does no longer exists.', 401)
    );
  }

  // 4. Check if user changed password after the token was issued
  if(currentUser.changedPasswordAfter(decode.iat)){
    return next(new appError('User recently changed password! please login again.', 401));
  }

  // GRANT accress to protected route
  req.user = currentUser;
  next();
});
