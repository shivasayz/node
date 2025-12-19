import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRouters.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// Middleware
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
//server static files - middleware
app.use(express.static(`./public`));

app.use((req, res, next) => {
  console.log('Hello from middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use(`/api/v1/tours`, tourRouter);
app.use(`/api/v1/users`, userRouter);

export default app;
