import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from './../controllers/userController.js';
import  { signup }  from '../controllers/authController.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);

userRouter.route(`/`).get(getAllUsers).post(createUser);
userRouter.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
