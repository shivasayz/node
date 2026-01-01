import catchAsync from '../utils/catchAsync.js';
import { User } from '../models/modelsExport.js';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
//   next();
});