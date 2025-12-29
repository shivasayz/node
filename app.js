import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRouters.js';
import userRouter from './routes/userRoutes.js';
import appError from './utils/appError.js';
import  globalErrorHandler from './controllers/errorController.js';

const app = express();

// Middleware
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
//server static files - middleware
app.use(express.static(`./public`));

// app.use((req, res, next) => {
//   console.log('Hello from middleware 👋');
//   next();
// });

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use(`/api/v1/tours`, tourRouter);
app.use(`/api/v1/users`, userRouter);

app.use(function (req, res, next) {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = "Resource not found"

  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Central Error Handling middleware
app.use(globalErrorHandler);

export default app;
