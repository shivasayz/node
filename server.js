import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';
import morgan from 'morgan';
import app from './app.js';

// console.log(process.env.NODE_ENV); // now it will print "development"

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
