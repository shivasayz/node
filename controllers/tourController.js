import fs from 'fs';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tours = [];
try {
  tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );
} catch (err) {
  console.error('Error reading tours JSON:', err);
}

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'there is no name and price',
    });
  }
  next();
};

const checkID = (req, res, next, val) => {
  console.log(`id is ${val}`);
  if (val > tours.length) {
    return res.status(404).json({
      status: 'failed',
      error: {
        message: 'Invalid Id',
        status: 404,
      },
    });
  }
  next();
};

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTourById = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 200,
    tour: tour,
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    result: {
      status: 'success',
      message: 'tour updated successfully',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    result: {
      status: 204,
      message: null,
      data: null,
    },
  });
};

export default {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
};
